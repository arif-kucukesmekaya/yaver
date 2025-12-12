import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../../core/middleware/auth';
import { adminMiddleware } from './admin.middleware';
import { AdminService } from './admin.service';
import {
    paginationSchema,
    adjustCreditsSchema,
    assignRoleSchema,
    updateMarketplaceConfigSchema,
} from './admin.schema';

const adminRoutes = new Hono();

// All admin routes require authentication + admin role
adminRoutes.use('*', authMiddleware);
adminRoutes.use('*', adminMiddleware);

// ==================== DASHBOARD ====================

// GET /admin/dashboard - Get dashboard statistics
adminRoutes.get('/dashboard', async (c) => {
    const stats = await AdminService.getDashboardStats();
    const activity = await AdminService.getRecentActivity();

    return c.json({
        success: true,
        data: {
            stats,
            recentActivity: activity,
        },
        timestamp: new Date().toISOString(),
    });
});

// ==================== USERS ====================

// GET /admin/users - List all users with pagination
adminRoutes.get('/users', zValidator('query', paginationSchema), async (c) => {
    const params = c.req.valid('query');
    const result = await AdminService.getUsers(params);

    return c.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
    });
});

// GET /admin/users/:userId - Get user details
adminRoutes.get('/users/:userId', async (c) => {
    const userId = parseInt(c.req.param('userId'));
    const user = await AdminService.getUserDetails(userId);

    return c.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
    });
});

// POST /admin/users/:userId/credits - Adjust user credits
adminRoutes.post(
    '/users/:userId/credits',
    zValidator('json', adjustCreditsSchema),
    async (c) => {
        const userId = parseInt(c.req.param('userId'));
        const adminUser = c.get('user');
        const { amount, reason } = c.req.valid('json');

        const result = await AdminService.adjustUserCredits(
            userId,
            amount,
            reason,
            adminUser.id
        );

        return c.json({
            success: true,
            message: 'Credits adjusted successfully',
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
);

// POST /admin/users/:userId/roles - Assign role to user
adminRoutes.post(
    '/users/:userId/roles',
    zValidator('json', assignRoleSchema),
    async (c) => {
        const userId = parseInt(c.req.param('userId'));
        const { roleId } = c.req.valid('json');

        const result = await AdminService.assignRole(userId, roleId);

        return c.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString(),
        });
    }
);

// DELETE /admin/users/:userId/roles/:roleId - Remove role from user
adminRoutes.delete('/users/:userId/roles/:roleId', async (c) => {
    const userId = parseInt(c.req.param('userId'));
    const roleId = parseInt(c.req.param('roleId'));

    const result = await AdminService.removeRole(userId, roleId);

    return c.json({
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
    });
});

// ==================== ROLES ====================

// GET /admin/roles - List all roles
adminRoutes.get('/roles', async (c) => {
    const roles = await AdminService.getRoles();

    return c.json({
        success: true,
        data: roles,
        timestamp: new Date().toISOString(),
    });
});

// ==================== MARKETPLACES ====================

// GET /admin/marketplaces - List marketplaces with configs
adminRoutes.get('/marketplaces', async (c) => {
    const marketplaces = await AdminService.getMarketplaces();

    return c.json({
        success: true,
        data: marketplaces,
        timestamp: new Date().toISOString(),
    });
});

// PATCH /admin/marketplaces/:id/config - Update marketplace config
adminRoutes.patch(
    '/marketplaces/:id/config',
    zValidator('json', updateMarketplaceConfigSchema),
    async (c) => {
        const marketplaceId = parseInt(c.req.param('id'));
        const config = c.req.valid('json');

        const result = await AdminService.updateMarketplaceConfig(marketplaceId, config);

        return c.json({
            success: true,
            message: 'Marketplace config updated',
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
);

// ==================== SUBSCRIPTIONS ====================

// GET /admin/plans - List subscription plans
adminRoutes.get('/plans', async (c) => {
    const plans = await AdminService.getSubscriptionPlans();

    return c.json({
        success: true,
        data: plans,
        timestamp: new Date().toISOString(),
    });
});

export { adminRoutes };
export default adminRoutes;
