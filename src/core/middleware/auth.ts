import type { Context, Next } from 'hono';
import { verifyToken } from '../../shared/utils/jwt';
import { db } from '../database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { AuthenticationError } from '../../shared/utils/errors';

export interface AuthUser {
  id: number;
  email: string;
}

// Extend Hono context with user
declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);

    // Verify user exists
    const userData = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!userData) {
      throw new AuthenticationError('User not found');
    }

    // Store user in context
    c.set('user', {
      id: userData.id,
      email: userData.email,
    });

    await next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Invalid or expired token');
  }
};
