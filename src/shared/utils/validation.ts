import { z } from 'zod';

// Common validation schemas
export const schemas = {
  // Email validation
  email: z.string().email('Invalid email format').toLowerCase(),

  // Password validation
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  // ID validation
  id: z.number().int().positive('ID must be a positive integer'),
  optionalId: z.number().int().positive().optional(),

  // Pagination
  pagination: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10)),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((val) => Math.min(100, parseInt(val, 10))),
  }),

  // Text fields
  name: z.string().min(2).max(255).trim(),
  shortText: z.string().min(1).max(500).trim(),
  longText: z.string().min(10).max(5000).trim(),

  // URL validation
  url: z.string().url('Invalid URL format').max(2048),
  optionalUrl: z.string().url().max(2048).optional(),

  // Date validation
  dateString: z.string().datetime('Invalid date format'),
  futureDate: z.string().datetime().refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  ),

  // Enum helpers
  productStatus: z.enum(['draft', 'processing', 'completed', 'failed']),
  transactionType: z.enum(['purchase', 'monthly_refill', 'usage', 'bonus']),
};

// Validation error formatter
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

// Helper to validate and parse
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string[]> }> {
  try {
    const parsed = await schema.parseAsync(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    throw error;
  }
}
