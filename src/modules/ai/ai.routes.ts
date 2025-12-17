import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../../core/middleware/auth';
import { openAIService } from './openai.service';
import { CreditService } from '../credits/credit.service';
import { db } from '../../core/database';
import { products, marketplaceListings, categories, marketplaceConfigs } from '../../core/database/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';
import { generateContentSchema, previewContentSchema } from './ai.schema';

const aiRoutes = new Hono();

// Apply auth middleware
aiRoutes.use('*', authMiddleware);

/**
 * Calculate total credit cost based on marketplace configs
 * Trendyol = 1, Hepsiburada = 1, Amazon = 2 (from JSONB config)
 */
async function calculateCreditCost(marketplaceIds: number[]): Promise<{ total: number; breakdown: Record<number, number> }> {
  const configs = await db.query.marketplaceConfigs.findMany({
    where: inArray(marketplaceConfigs.marketplaceId, marketplaceIds),
    with: {
      marketplace: true,
    },
  });

  const breakdown: Record<number, number> = {};
  let total = 0;

  for (const marketplaceId of marketplaceIds) {
    const config = configs.find(c => c.marketplaceId === marketplaceId);
    const configData = config?.config as { credit_cost?: number } | null;
    const cost = configData?.credit_cost ?? 1; // Default to 1 if not specified
    breakdown[marketplaceId] = cost;
    total += cost;
  }

  return { total, breakdown };
}

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

  // Calculate credit cost from marketplace configs (Amazon = 2, others = 1)
  const { total: requiredCredits, breakdown: creditBreakdown } = await calculateCreditCost(marketplaceIds);
  const hasCredits = await CreditService.hasEnoughCredits(user.id, requiredCredits);

  if (!hasCredits) {
    const available = await CreditService.getUserCredits(user.id);
    return c.json({
      success: false,
      error: `Insufficient credits. Required: ${requiredCredits}, Available: ${available}`,
      creditBreakdown,
      timestamp: new Date().toISOString(),
    }, 402);
  }

  // Update product status to processing
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

    // Use transaction to ensure atomicity: save listings + deduct credits together
    const savedListings = await db.transaction(async (tx) => {
      // Save listings to database
      const listings = await Promise.all(
        generatedContents.map((content, index) =>
          tx
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

      // Deduct credits within the same transaction
      await CreditService.deductCredits(
        user.id,
        requiredCredits,
        `AI content generation for product #${productId} (${marketplaceIds.length} marketplaces)`
      );

      return listings;
    });

    // Update product status to completed
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
        creditBreakdown,
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

// POST /ai/preview - Preview content without spending credits
aiRoutes.post('/preview', zValidator('json', previewContentSchema), async (c) => {
  const { rawUserPrompt, brandName, categoryId, marketplaceId } = c.req.valid('json');

  let categoryName: string | undefined;
  if (categoryId) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });
    categoryName = category?.name;
  }

  // Get credit cost for info (not charged)
  const { total: creditCost } = await calculateCreditCost([marketplaceId]);

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
      data: {
        ...content,
        creditCost, // Show how much it would cost
      },
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
