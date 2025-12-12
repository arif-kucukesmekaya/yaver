import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../../core/middleware/auth';
import { openAIService } from './openai.service';
import { CreditService } from '../credits/credit.service';
import { db } from '../../core/database';
import { products, marketplaceListings, categories } from '../../core/database/schema';
import { eq, and } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

const aiRoutes = new Hono();

// Apply auth middleware
aiRoutes.use('*', authMiddleware);

// Validation schema
const generateContentSchema = z.object({
  productId: z.number().int().positive(),
  marketplaceIds: z.array(z.number().int().positive()).min(1),
});

// POST /ai/generate-content - Generate marketplace-specific content
aiRoutes.post('/generate-content', zValidator('json', generateContentSchema), async (c) => {
  const user = c.get('user');
  const { productId, marketplaceIds } = c.req.valid('json');

  // Get product
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.id, productId),
      eq(products.userId, user.id)
    ),
    with: {
      category: true,
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check credits (1 credit per marketplace)
  const requiredCredits = marketplaceIds.length;
  const hasCredits = await CreditService.hasEnoughCredits(user.id, requiredCredits);

  if (!hasCredits) {
    const available = await CreditService.getUserCredits(user.id);
    return c.json({
      success: false,
      error: `Insufficient credits. Required: ${requiredCredits}, Available: ${available}`,
      timestamp: new Date().toISOString(),
    }, 402);
  }

  // Update product status
  await db
    .update(products)
    .set({ productStatus: 'processing' })
    .where(eq(products.id, productId));

  try {
    // Generate content for all marketplaces
    const generatedContents = await openAIService.generateForAllMarketplaces(
      product.rawUserPrompt || '',
      product.brandName || undefined,
      product.category?.name,
      marketplaceIds
    );

    // Save to database
    const savedListings = await Promise.all(
      generatedContents.map((content, index) =>
        db
          .insert(marketplaceListings)
          .values({
            productId,
            marketplaceId: marketplaceIds[index] as number,
            generatedTitle: content.title,
            generatedDescription: content.description,
            listingStatus: 'draft',
          })
          .returning()
          .then((rows) => rows[0])
      )
    );

    // Deduct credits
    await CreditService.deductCredits(
      user.id,
      requiredCredits,
      `AI content generation for product #${productId}`
    );

    // Update product status
    await db
      .update(products)
      .set({ productStatus: 'completed' })
      .where(eq(products.id, productId));

    return c.json({
      success: true,
      message: 'Content generated successfully',
      data: {
        productId,
        creditsUsed: requiredCredits,
        listings: savedListings,
        generatedContents,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Update product status to failed
    await db
      .update(products)
      .set({ productStatus: 'failed' })
      .where(eq(products.id, productId));

    console.error('AI generation error:', error);
    
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Content generation failed',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// GET /ai/preview - Preview content without spending credits
aiRoutes.post('/preview', zValidator('json', z.object({
  rawUserPrompt: z.string().min(10),
  brandName: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
  marketplaceId: z.number().int().positive(),
})), async (c) => {
  const { rawUserPrompt, brandName, categoryId, marketplaceId } = c.req.valid('json');

  let categoryName: string | undefined;
  if (categoryId) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });
    categoryName = category?.name;
  }

  try {
    const content = await openAIService.generateMarketplaceContent({
      rawUserPrompt,
      brandName,
      categoryName,
      marketplaceId,
    });

    return c.json({
      success: true,
      message: 'Preview generated (no credits charged)',
      data: content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Preview generation failed',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

export { aiRoutes };

export default aiRoutes;
