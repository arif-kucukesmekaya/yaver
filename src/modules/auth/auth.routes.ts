import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { authMiddleware } from '../../core/middleware/auth';

const authRoutes = new Hono();

// POST /auth/register
authRoutes.post('/register', zValidator('json', registerSchema), AuthController.register);

// POST /auth/login
authRoutes.post('/login', zValidator('json', loginSchema), AuthController.login);

// GET /auth/me (Protected)
authRoutes.get('/me', authMiddleware, AuthController.getProfile);

export default authRoutes;
