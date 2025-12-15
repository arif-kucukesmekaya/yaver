import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AuthController } from './auth.controller';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    googleLoginSchema
} from './auth.schema';
import { authMiddleware } from '../../core/middleware/auth';

const authRoutes = new Hono();

// POST /auth/register
authRoutes.post('/register', zValidator('json', registerSchema), AuthController.register);

// POST /auth/login
authRoutes.post('/login', zValidator('json', loginSchema), AuthController.login);

// POST /auth/google - Google OAuth login
authRoutes.post('/google', zValidator('json', googleLoginSchema), AuthController.googleLogin);

// POST /auth/refresh - Refresh access token
authRoutes.post('/refresh', zValidator('json', refreshTokenSchema), AuthController.refreshToken);

// POST /auth/logout - Revoke refresh token
authRoutes.post('/logout', zValidator('json', refreshTokenSchema), AuthController.logout);

// POST /auth/forgot-password - Request password reset
authRoutes.post('/forgot-password', zValidator('json', forgotPasswordSchema), AuthController.forgotPassword);

// POST /auth/reset-password - Reset password with token
authRoutes.post('/reset-password', zValidator('json', resetPasswordSchema), AuthController.resetPassword);

// GET /auth/me (Protected)
authRoutes.get('/me', authMiddleware, AuthController.getProfile);

export default authRoutes;
