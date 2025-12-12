import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { AdminService } from './admin.service';

/**
 * Middleware to check if user is admin
 * Must be used after authMiddleware
 */
export async function adminMiddleware(c: Context, next: Next) {
    const user = c.get('user');

    if (!user) {
        throw new HTTPException(401, { message: 'Authentication required' });
    }

    const isAdmin = await AdminService.isAdmin(user.id);

    if (!isAdmin) {
        throw new HTTPException(403, { message: 'Admin access required' });
    }

    await next();
}
