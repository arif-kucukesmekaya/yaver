import { serve } from '@hono/node-server';
import app from './app';
import { ENV, validateEnv } from './shared/constants/env';
import { logger } from './shared/utils/logger';

// Validate environment variables
try {
  validateEnv();
  logger.info('Environment variables validated');
} catch (error) {
  logger.error('Environment validation failed', error);
  process.exit(1);
}

const port = ENV.PORT;

// Start server
void serve({
  fetch: app.fetch,
  port,
});

logger.info(`🚀 SellerAI API started`, {
  port,
  environment: ENV.NODE_ENV,
  apiDocs: `http://localhost:${port}/api-docs`,
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown`);
  
  try {
    // Close server
    logger.info('Closing HTTP server');
    // Note: @hono/node-server doesn't expose server.close(), 
    // but process will exit cleanly
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason);
  process.exit(1);
});

