import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from '@hono/node-server/serve-static';
import { swaggerUI } from '@hono/swagger-ui';
import { errorHandler, rateLimiters } from './core/middleware';
import { logger } from './shared/utils/logger';
import { openAPISpec } from './docs/openapi';

// Import all module routes
import {
  authRoutes,
  productsRoutes,
  creditsRoutes,
  aiRoutes,
  uploadRoutes,
  marketplaceRoutes,
  categoriesRoutes,
  adminRoutes,
  queueRoutes,
  errorsRoutes,
  subscriptionRoutes,
} from './modules';
import sseRoutes from './modules/sse/sse.routes';

const app = new Hono();

// Global middleware
app.use('*', honoLogger());
app.use('*', cors());
app.use('*', prettyJSON());

// Serve static files (uploads)
app.use('/uploads/*', serveStatic({ root: './' }));

// API Documentation
app.get('/api-docs', swaggerUI({ url: '/api-docs/openapi.json' }));
app.get('/api-docs/openapi.json', (c) => c.json(openAPISpec));

// Health check
app.get('/', (c) => {
  logger.info('Health check accessed');
  return c.json({
    success: true,
    message: '🚀 SellerAI API is running',
    version: '2.0.0',
    documentation: '/api-docs',
    features: {
      authentication: true,
      products: true,
      aiGeneration: true,
      creditSystem: true,
      fileUpload: true,
      rateLimit: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount module routes with rate limiters
// Auth routes with stricter rate limiting (10 requests per 15 min)
app.use('/auth/*', rateLimiters.auth);
app.route('/auth', authRoutes);

// AI routes with strict rate limiting (5 requests per minute)
app.use('/ai/*', rateLimiters.ai);
app.route('/ai', aiRoutes);

// Upload routes with rate limiting (10 uploads per minute)
app.use('/upload/*', rateLimiters.upload);
app.route('/upload', uploadRoutes);

// Other routes (no specific rate limit, can add global if needed)
app.route('/products', productsRoutes);
app.route('/credits', creditsRoutes);
app.route('/marketplaces', marketplaceRoutes);
app.route('/categories', categoriesRoutes);
app.route('/queue', queueRoutes);
app.route('/errors', errorsRoutes);
app.route('/subscriptions', subscriptionRoutes);
app.route('/sse', sseRoutes); // Real-time updates

// Admin routes (protected by auth + admin middleware)
app.route('/admin', adminRoutes);

// 404 handler
app.notFound((c) => {
  logger.warn('Route not found', { path: c.req.path });
  return c.json(
    {
      success: false,
      error: 'Route not found',
      path: c.req.path,
      timestamp: new Date().toISOString(),
    },
    404
  );
});

// Global error handler
app.onError(errorHandler);

logger.info('Application initialized successfully');

export default app;
