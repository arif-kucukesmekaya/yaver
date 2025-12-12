import { z } from 'zod';

// Query schemas
export const paginationSchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? Math.min(100, parseInt(val)) : 20),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const userIdParamSchema = z.object({
    userId: z.string().transform(val => parseInt(val)),
});

// User management schemas
export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
});

export const adjustCreditsSchema = z.object({
    amount: z.number().int().min(-10000).max(10000),
    reason: z.string().min(3).max(500),
});

export const assignRoleSchema = z.object({
    roleId: z.number().int().positive(),
});

// Marketplace config schema
export const updateMarketplaceConfigSchema = z.object({
    max_title_length: z.number().int().positive().optional(),
    description_max_length: z.number().int().positive().optional(),
    language: z.enum(['tr', 'en']).optional(),
    credit_cost: z.number().int().positive().optional(),
    banned_words: z.array(z.string()).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AdjustCreditsInput = z.infer<typeof adjustCreditsSchema>;
