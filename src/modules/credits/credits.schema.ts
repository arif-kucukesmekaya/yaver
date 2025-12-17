import { z } from 'zod';

// ========================
// CREDITS SCHEMAS
// ========================

/**
 * Schema for purchasing credits
 */
export const purchaseCreditsSchema = z.object({
    amount: z.number().int().positive().min(1).max(1000),
    paymentMethod: z.enum(['credit_card', 'paypal', 'stripe']).optional(),
});

// ========================
// TYPE EXPORTS
// ========================

export type PurchaseCreditsInput = z.infer<typeof purchaseCreditsSchema>;
