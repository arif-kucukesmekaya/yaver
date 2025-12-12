import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
} from '../../shared/utils/errors';

export const errorHandler = (err: Error, c: Context) => {
  console.error('❌ Error:', err);

  // Hono HTTP Exception
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      err.status
    );
  }

  // Custom errors
  if (err instanceof ValidationError) {
    return c.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      400
    );
  }

  if (err instanceof AuthenticationError) {
    return c.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      401
    );
  }

  if (err instanceof NotFoundError) {
    return c.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      404
    );
  }

  if (err instanceof ConflictError) {
    return c.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      409
    );
  }

  if (err instanceof DatabaseError) {
    return c.json(
      {
        success: false,
        error: 'Database error occurred',
        timestamp: new Date().toISOString(),
      },
      500
    );
  }

  // Unknown error
  return c.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      timestamp: new Date().toISOString(),
    },
    500
  );
};

