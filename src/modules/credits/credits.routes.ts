import { Hono } from 'hono';
import { authMiddleware } from '../../core/middleware/auth';
import { CreditService } from './credit.service';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const creditsRoutes = new Hono();

// Apply auth middleware
creditsRoutes.use('*', authMiddleware);

// GET /credits - Get user's credit balance
creditsRoutes.get('/', async (c) => {
  const user = c.get('user');
  const details = await CreditService.getUserCreditDetails(user.id);

  return c.json({
    success: true,
    data: details,
    timestamp: new Date().toISOString(),
  });
});

// GET /credits/history - Get transaction history
creditsRoutes.get('/history', async (c) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');

  const history = await CreditService.getTransactionHistory(user.id, limit);

  return c.json({
    success: true,
    data: history,
    timestamp: new Date().toISOString(),
  });
});

// POST /credits/purchase - Purchase credits (placeholder)
creditsRoutes.post('/purchase', zValidator('json', z.object({
  amount: z.number().int().positive().min(1).max(1000),
  paymentMethod: z.enum(['credit_card', 'paypal', 'stripe']).optional(),
})), async (c) => {
  const user = c.get('user');
  const { amount } = c.req.valid('json');

  // TODO: Implement actual payment integration
  // For now, just add credits for testing
  await CreditService.addCredits(
    user.id,
    amount,
    `Credit purchase: ${amount} credits`
  );

  const newBalance = await CreditService.getUserCreditDetails(user.id);

  return c.json({
    success: true,
    message: `Successfully purchased ${amount} credits`,
    data: {
      creditsPurchased: amount,
      newBalance,
    },
    timestamp: new Date().toISOString(),
  });
});

export { creditsRoutes };

export default creditsRoutes;
