import { z } from 'zod';

// ========================
// PRODUCT SCHEMAS
// ========================

/**
 * Schema for creating a new product
 */
export const createProductSchema = z.object({
    brandName: z.string().min(2).max(255).optional(),
    categoryId: z.number().int().positive().optional(),
    rawUserPrompt: z.string().min(10).max(5000),
    marketplaceIds: z.array(z.number().int().positive()).optional(),
    imageUrl: z.string().url('Invalid image URL format').max(512).optional(),
    imageBase64: z.string().optional(),
});

/**
 * Schema for updating an existing product
 */
export const updateProductSchema = z.object({
    brandName: z.string().min(2).max(255).optional(),
    categoryId: z.number().int().positive().optional(),
    rawUserPrompt: z.string().min(10).max(5000).optional(),
    productStatus: z.enum(['draft', 'processing', 'completed', 'failed']).optional(),
});

/**
 * Schema for product list query parameters
 */
export const querySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? Math.min(50, parseInt(val)) : 10),
});

/**
 * Schema for updating a marketplace listing
 */
export const updateListingSchema = z.object({
    generatedTitle: z.string().min(5).max(500).optional(),
    generatedDescription: z.string().min(10).max(10000).optional(),
    listingStatus: z.enum(['draft', 'published', 'error']).optional(),
});

// ========================
// TYPE EXPORTS
// ========================

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type QueryInput = z.infer<typeof querySchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
