import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (c: Context) => string;
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key]?.resetTime && store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = 'Too many requests, please try again later',
    keyGenerator = (c: Context) => {
      // Use IP address or user ID
      const forwarded = c.req.header('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      const userId = c.get('user')?.id;
      return userId ? `user:${userId}` : `ip:${ip}`;
    },
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    const { count, resetTime } = store[key];

    // Set rate limit headers
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, max - count).toString());
    c.header('X-RateLimit-Reset', new Date(resetTime).toISOString());

    if (count > max) {
      throw new HTTPException(429, { message });
    }

    await next();
  };
}

// Preset rate limiters
export const rateLimiters = {
  // Global API rate limit
  global: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later',
  }),

  // Auth endpoints (stricter)
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many authentication attempts, please try again later',
  }),

  // AI generation (very strict, costs credits)
  ai: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: 'AI generation rate limit exceeded, please wait a moment',
  }),

  // File upload
  upload: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many file uploads, please slow down',
  }),
};
