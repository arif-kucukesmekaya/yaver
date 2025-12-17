import { z } from 'zod';

// ========================
// AI CONTENT GENERATION SCHEMAS
// ========================

/**
 * Schema for generating AI content for marketplaces
 */
export const generateContentSchema = z.object({
    productId: z.number().int().positive(),
    marketplaceIds: z.array(z.number().int().positive()).min(1),
});

/**
 * Schema for previewing AI content without spending credits
 */
export const previewContentSchema = z.object({
    rawUserPrompt: z.string().min(10),
    brandName: z.string().optional(),
    categoryId: z.number().int().positive().optional(),
    marketplaceId: z.number().int().positive(),
});

// ========================
// TYPE EXPORTS
// ========================

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type PreviewContentInput = z.infer<typeof previewContentSchema>;
