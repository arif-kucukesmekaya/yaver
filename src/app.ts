import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from '@hono/node-server/serve-static';
import { swaggerUI } from '@hono/swagger-ui';
import { errorHandler } from './core/middleware';
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
} from './modules';

const app = new Hono();

// Global middleware
app.use('*', honoLogger());
app.use('*', cors());
app.use('*', prettyJSON());

// Global rate limiter (optional, can be disabled)
// app.use('*', rateLimiters.global);

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
app.route('/auth', authRoutes);
app.route('/products', productsRoutes);
app.route('/credits', creditsRoutes);
app.route('/ai', aiRoutes);
app.route('/upload', uploadRoutes);
app.route('/marketplaces', marketplaceRoutes);
app.route('/categories', categoriesRoutes);

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
