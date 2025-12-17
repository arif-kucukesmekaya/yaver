import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../core/database';
import {
  products,
  productSourceImages,
  productMarketplaceSelections,
  marketplaceListings,
  aiEnhancedImages,
  categories,
} from '../../core/database/schema';
import { authMiddleware } from '../../core/middleware/auth';
import { NotFoundError, ValidationError } from '../../shared/utils/errors';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { AIService } from '../ai/ai.service';
import { imageProcessingQueue } from '../../core/database/schema';

const productRoutes = new Hono();

// Apply auth middleware to all routes
productRoutes.use('*', authMiddleware);

// Validation schemas
const createProductSchema = z.object({
  brandName: z.string().min(2).max(255).optional(),
  categoryId: z.number().int().positive().optional(),
  rawUserPrompt: z.string().min(10).max(5000),
  marketplaceIds: z.array(z.number().int().positive()).optional(),
  imageUrl: z.string().url('Invalid image URL format').max(512).optional(),
  // 🔥 NEW: Accept base64 image data from frontend
  imageBase64: z.string().optional(),
});

const updateProductSchema = z.object({
  brandName: z.string().min(2).max(255).optional(),
  categoryId: z.number().int().positive().optional(),
  rawUserPrompt: z.string().min(10).max(5000).optional(),
  productStatus: z.enum(['draft', 'processing', 'completed', 'failed']).optional(),
});

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(50, parseInt(val)) : 10),
});

// GET /products - List user's products
productRoutes.get('/', zValidator('query', querySchema), async (c) => {
  const user = c.get('user');
  const { page, limit } = c.req.valid('query');
  const offset = (page - 1) * limit;

  const userProducts = await db.query.products.findMany({
    where: eq(products.userId, user.id),
    with: {
      category: true,
      sourceImages: true,
      enhancedImages: true,
      listings: {
        with: {
          marketplace: true,
        },
      },
    },
    limit,
    offset,
    orderBy: [desc(products.createdAt)],
  });

  // Count total products
  const [totalResult] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.userId, user.id));

  // 🔥 Count listings by status for user's products
  const userProductIds = userProducts.map(p => p.id);
  let totalPublished = 0;
  let totalDraft = 0;
  if (userProductIds.length > 0) {
    const listingsStats = await db
      .select({
        status: marketplaceListings.listingStatus,
        count: count()
      })
      .from(marketplaceListings)
      .where(sql`${marketplaceListings.productId} IN (SELECT id FROM products WHERE user_id = ${user.id})`)
      .groupBy(marketplaceListings.listingStatus);

    listingsStats.forEach(stat => {
      if (stat.status === 'published') totalPublished = stat.count;
      if (stat.status === 'draft') totalDraft = stat.count;
    });
  }

  const total = totalResult?.count || 0;
  const totalPages = Math.ceil(total / limit);

  return c.json({
    success: true,
    data: userProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      totalPublished, // 🔥 For "Aktif Listeler"
      totalDraft,     // 🔥 For "Taslak Listeler"
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /products/:id - Get single product
productRoutes.get('/:id', async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));

  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  const product = await db.query.products.findFirst({
    where: and(
      eq(products.id, productId),
      eq(products.userId, user.id)
    ),
    with: {
      category: true,
      sourceImages: true,
      enhancedImages: true,
      marketplaceSelections: {
        with: {
          marketplace: true,
        },
      },
      listings: {
        with: {
          marketplace: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return c.json({
    success: true,
    data: product,
    timestamp: new Date().toISOString(),
  });
});

// POST /products - Create product
productRoutes.post('/', zValidator('json', createProductSchema), async (c) => {
  const user = c.get('user');
  const { brandName, categoryId, rawUserPrompt, marketplaceIds, imageUrl, imageBase64 } = c.req.valid('json');

  // Validate category if provided
  if (categoryId) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) {
      throw new ValidationError('Invalid category');
    }
  }

  // Validate marketplaces if provided
  if (marketplaceIds && marketplaceIds.length > 0) {
    const validMarketplaces = await db.query.marketplaces.findMany({
      where: (m, { inArray }) => inArray(m.id, marketplaceIds),
    });

    if (validMarketplaces.length !== marketplaceIds.length) {
      throw new ValidationError('Invalid marketplace IDs');
    }
  }

  // Create product
  const [newProduct] = await db
    .insert(products)
    .values({
      userId: user.id,
      categoryId,
      brandName,
      rawUserPrompt,
      productStatus: 'draft',
    })
    .returning();

  if (!newProduct) {
    throw new Error('Failed to create product');
  }

  // 🔥 Handle source image (base64 or URL)
  let finalImageUrl = imageUrl;

  if (imageBase64 && !imageUrl) {
    // Save base64 image to uploads folder
    const fs = await import('fs/promises');
    const path = await import('path');

    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Extract mime type and data
    const matches = imageBase64.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (matches && matches[2]) {
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const base64Data = matches[2];
      const fileName = `product_${newProduct.id}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));

      // Create URL (relative to server)
      finalImageUrl = `/uploads/${fileName}`;
      console.log(`📁 Saved source image: ${finalImageUrl}`);
    }
  }

  // Add source image if available
  if (finalImageUrl) {
    await db.insert(productSourceImages).values({
      productId: newProduct.id,
      imageUrl: finalImageUrl,
    });
    console.log(`🖼️ Source image saved for product ${newProduct.id}: ${finalImageUrl}`);
  }

  // Add marketplace selections
  if (marketplaceIds && marketplaceIds.length > 0) {
    await db.insert(productMarketplaceSelections).values(
      marketplaceIds.map((marketplaceId) => ({
        productId: newProduct.id,
        marketplaceId,
        isSelected: true,
      }))
    );
  }

  // Fetch complete product data
  const completeProduct = await db.query.products.findFirst({
    where: eq(products.id, newProduct.id),
    with: {
      category: true,
      sourceImages: true,
      marketplaceSelections: {
        with: {
          marketplace: true,
        },
      },
    },
  });

  return c.json(
    {
      success: true,
      message: 'Product created successfully',
      data: completeProduct,
      timestamp: new Date().toISOString(),
    },
    201
  );
});

// PATCH /products/:id - Update product
productRoutes.patch('/:id', zValidator('json', updateProductSchema), async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));
  const updates = c.req.valid('json');

  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  // Check product exists and belongs to user
  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, user.id)),
  });

  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }

  // Update product
  await db
    .update(products)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  // Fetch updated product
  const updatedProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      category: true,
      sourceImages: true,
      marketplaceSelections: {
        with: {
          marketplace: true,
        },
      },
      listings: {
        with: {
          marketplace: true,
        },
      },
    },
  });

  return c.json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
    timestamp: new Date().toISOString(),
  });
});

// DELETE /products/:id - Delete product
productRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));

  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  // Check product exists and belongs to user
  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, user.id)),
  });

  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }

  // Delete product (cascade will handle related records)
  await db.delete(products).where(eq(products.id, productId));

  return c.json({
    success: true,
    message: 'Product deleted successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /products/:id/listings - Get product listings
productRoutes.get('/:id/listings', async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));

  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  // Check product exists and belongs to user
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, user.id)),
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Get listings
  const listings = await db.query.marketplaceListings.findMany({
    where: eq(marketplaceListings.productId, productId),
    with: {
      marketplace: {
        with: {
          configs: true,
        },
      },
    },
  });

  return c.json({
    success: true,
    data: listings,
    timestamp: new Date().toISOString(),
  });
});

// PATCH /products/:id/listings/:marketplaceId - Edit a listing
const updateListingSchema = z.object({
  generatedTitle: z.string().min(5).max(500).optional(),
  generatedDescription: z.string().min(10).max(10000).optional(),
  listingStatus: z.enum(['draft', 'published', 'error']).optional(),
});

productRoutes.patch('/:id/listings/:marketplaceId', zValidator('json', updateListingSchema), async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));
  const marketplaceId = parseInt(c.req.param('marketplaceId'));
  const updates = c.req.valid('json');

  if (isNaN(productId) || isNaN(marketplaceId)) {
    throw new ValidationError('Invalid product or marketplace ID');
  }

  // Check product exists and belongs to user
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, user.id)),
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check listing exists
  const existingListing = await db.query.marketplaceListings.findFirst({
    where: and(
      eq(marketplaceListings.productId, productId),
      eq(marketplaceListings.marketplaceId, marketplaceId)
    ),
  });

  if (!existingListing) {
    throw new NotFoundError('Listing not found for this marketplace');
  }

  // Update listing
  const [updatedListing] = await db
    .update(marketplaceListings)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(
      eq(marketplaceListings.productId, productId),
      eq(marketplaceListings.marketplaceId, marketplaceId)
    ))
    .returning();

  if (!updatedListing) {
    throw new Error('Failed to update listing');
  }

  // Fetch with marketplace data
  const listing = await db.query.marketplaceListings.findFirst({
    where: eq(marketplaceListings.id, updatedListing.id),
    with: {
      marketplace: {
        with: {
          configs: true,
        },
      },
    },
  });

  return c.json({
    success: true,
    message: 'Listing updated successfully',
    data: listing,
    timestamp: new Date().toISOString(),
  });
});


// POST /products/:id/generate-ai - Trigger AI content generation
productRoutes.post('/:id/generate-ai', async (c) => {
  const user = c.get('user');
  const productId = parseInt(c.req.param('id'));

  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  // 1. Get Product with relations
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, user.id)),
    with: {
      category: true,
      marketplaceSelections: {
        with: {
          marketplace: true,
        },
      },
      sourceImages: true,
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Update status to processing
  await db.update(products)
    .set({ productStatus: 'processing', updatedAt: new Date() })
    .where(eq(products.id, productId));

  try {
    // 2. 🔥 CLEANUP: Delete old generation data first (fresh start!)
    console.log(`🗑️ Cleaning old generation data for product ${productId}...`);

    // Delete old AI-generated images
    await db.delete(aiEnhancedImages)
      .where(eq(aiEnhancedImages.productId, productId));

    // Delete old marketplace listings
    await db.delete(marketplaceListings)
      .where(eq(marketplaceListings.productId, productId));

    // Delete old/failed queue jobs
    await db.delete(imageProcessingQueue)
      .where(eq(imageProcessingQueue.productId, productId));

    console.log(`✅ Cleanup complete - starting fresh generation`);

    // 3. Queue NEW Image Generation Job
    const sourceImage = product.sourceImages[0]?.imageUrl || 'https://via.placeholder.com/500?text=No+Image';

    await db.insert(imageProcessingQueue).values({
      productId: product.id,
      sourceImageUrl: sourceImage,
      status: 'pending',
    });

    // 4. ⚡ Generate Text Listings (PARALLEL for speed)
    const generationResults = [];

    for (const selection of product.marketplaceSelections) {
      if (selection.isSelected) {
        const marketplaceName = selection.marketplace.name;

        try {
          const aiContent = await AIService.generateListing(product, marketplaceName);

          // Save to marketplaceListings table
          // Check if exists first
          const existingListing = await db.query.marketplaceListings.findFirst({
            where: and(
              eq(marketplaceListings.productId, product.id),
              eq(marketplaceListings.marketplaceId, selection.marketplaceId)
            )
          });

          if (existingListing) {
            await db.update(marketplaceListings)
              .set({
                generatedTitle: aiContent.title,
                generatedDescription: aiContent.description, // HTML/Bullet points
                listingStatus: 'draft',
                updatedAt: new Date()
              })
              .where(eq(marketplaceListings.id, existingListing.id));
          } else {
            await db.insert(marketplaceListings).values({
              productId: product.id,
              marketplaceId: selection.marketplaceId,
              generatedTitle: aiContent.title,
              generatedDescription: aiContent.description,
              listingStatus: 'draft'
            });
          }

          generationResults.push({ marketplace: marketplaceName, success: true });

        } catch (error) {
          console.error(`Failed generation for ${marketplaceName}:`, error);
          generationResults.push({ marketplace: marketplaceName, success: false });
        }
      }
    }

    return c.json({
      success: true,
      message: 'AI generation started',
      data: {
        textResults: generationResults,
        imageJob: 'queued'
      }
    });

  } catch (error) {
    console.error('Generation Error:', error);
    // Revert status on critical fail
    await db.update(products)
      .set({ productStatus: 'failed', updatedAt: new Date() })
      .where(eq(products.id, productId));

    throw error;
  }
});

export { productRoutes };

export default productRoutes;
