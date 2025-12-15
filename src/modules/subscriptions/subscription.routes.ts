import { Hono } from 'hono';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '../../core/middleware/auth';

const subscriptionRoutes = new Hono();

subscriptionRoutes.use('*', authMiddleware);
subscriptionRoutes.post('/upgrade', SubscriptionController.upgrade);

export default subscriptionRoutes;
