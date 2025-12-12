import { db } from '../../core/database';
import {
    users,
    userCredits,
    userRoles,
    roles,
    products,
    creditTransactions,
    marketplaceListings,
    marketplaceConfigs,
    subscriptionPlans,
    userSubscriptions,
} from '../../core/database/schema';
import { eq, desc, like, count, sql, and, gte } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

export interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalListings: number;
    totalCreditsUsed: number;
    newUsersToday: number;
    newProductsToday: number;
}

export class AdminService {
    /**
     * Check if user has admin role
     */
    static async isAdmin(userId: number): Promise<boolean> {
        const adminRole = await db.query.userRoles.findFirst({
            where: eq(userRoles.userId, userId),
            with: {
                role: true,
            },
        });

        return adminRole?.role?.roleName === 'Admin';
    }

    /**
     * Get dashboard statistics
     */
    static async getDashboardStats(): Promise<DashboardStats> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            [usersCount],
            [productsCount],
            [listingsCount],
            [creditsResult],
            [newUsersCount],
            [newProductsCount],
        ] = await Promise.all([
            db.select({ count: count() }).from(users),
            db.select({ count: count() }).from(products),
            db.select({ count: count() }).from(marketplaceListings),
            db.select({ total: sql<number>`COALESCE(SUM(ABS(amount)), 0)` })
                .from(creditTransactions)
                .where(eq(creditTransactions.transactionType, 'usage')),
            db.select({ count: count() }).from(users).where(gte(users.createdAt, today)),
            db.select({ count: count() }).from(products).where(gte(products.createdAt, today)),
        ]);

        return {
            totalUsers: usersCount?.count || 0,
            totalProducts: productsCount?.count || 0,
            totalListings: listingsCount?.count || 0,
            totalCreditsUsed: Number(creditsResult?.total) || 0,
            newUsersToday: newUsersCount?.count || 0,
            newProductsToday: newProductsCount?.count || 0,
        };
    }

    /**
     * Get all users with pagination
     */
    static async getUsers(options: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const { page, limit, search } = options;
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = search
            ? like(users.email, `%${search}%`)
            : undefined;

        const usersList = await db.query.users.findMany({
            where: whereClause,
            with: {
                profile: true,
                credits: true,
                userRoles: {
                    with: {
                        role: true,
                    },
                },
                subscriptions: {
                    with: { plan: true },
                    where: eq(userSubscriptions.isActive, true),
                },
            },
            limit,
            offset,
            orderBy: [desc(users.createdAt)],
        });

        const [totalResult] = await db
            .select({ count: count() })
            .from(users)
            .where(whereClause);

        return {
            users: usersList.map(u => ({
                id: u.id,
                email: u.email,
                firstName: u.profile?.firstName,
                lastName: u.profile?.lastName,
                credits: u.credits?.availableCredits || 0,
                roles: u.userRoles.map(ur => ur.role?.roleName).filter(Boolean),
                subscription: u.subscriptions[0]?.plan?.name || 'Free',
                createdAt: u.createdAt,
            })),
            pagination: {
                page,
                limit,
                total: totalResult?.count || 0,
                totalPages: Math.ceil((totalResult?.count || 0) / limit),
            },
        };
    }

    /**
     * Get single user details
     */
    static async getUserDetails(userId: number) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                profile: true,
                credits: true,
                products: {
                    limit: 10,
                    orderBy: [desc(products.createdAt)],
                    with: {
                        listings: true,
                    },
                },
                creditTransactions: {
                    limit: 20,
                    orderBy: [desc(creditTransactions.createdAt)],
                },
                subscriptions: {
                    with: { plan: true },
                },
                userRoles: {
                    with: { role: true },
                },
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            profile: user.profile,
            credits: user.credits,
            roles: user.userRoles.map(ur => ur.role),
            subscriptions: user.subscriptions,
            recentProducts: user.products,
            recentTransactions: user.creditTransactions,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    /**
     * Adjust user credits (admin action)
     */
    static async adjustUserCredits(
        userId: number,
        amount: number,
        reason: string,
        adminId: number
    ) {
        // Check user exists
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: { credits: true },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Create credit transaction
        await db.insert(creditTransactions).values({
            userId,
            amount,
            transactionType: amount > 0 ? 'bonus' : 'usage',
            description: `Admin adjustment: ${reason} (by admin #${adminId})`,
        });

        // The trigger will automatically update user_credits

        // Fetch updated credits
        const updatedCredits = await db.query.userCredits.findFirst({
            where: eq(userCredits.userId, userId),
        });

        return {
            userId,
            previousBalance: user.credits?.availableCredits || 0,
            adjustment: amount,
            newBalance: updatedCredits?.availableCredits || 0,
            reason,
        };
    }

    /**
     * Get all roles
     */
    static async getRoles() {
        return db.query.roles.findMany({
            orderBy: [roles.id],
        });
    }

    /**
     * Assign role to user
     */
    static async assignRole(userId: number, roleId: number) {
        // Check user exists
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Check role exists
        const role = await db.query.roles.findFirst({
            where: eq(roles.id, roleId),
        });

        if (!role) {
            throw new NotFoundError('Role not found');
        }

        // Check if already has role
        const existingRole = await db.query.userRoles.findFirst({
            where: and(
                eq(userRoles.userId, userId),
                eq(userRoles.roleId, roleId)
            ),
        });

        if (existingRole) {
            return { message: 'User already has this role' };
        }

        // Assign role
        await db.insert(userRoles).values({
            userId,
            roleId,
        });

        return { message: `Role '${role.roleName}' assigned to user` };
    }

    /**
     * Remove role from user
     */
    static async removeRole(userId: number, roleId: number) {
        const deleted = await db
            .delete(userRoles)
            .where(and(
                eq(userRoles.userId, userId),
                eq(userRoles.roleId, roleId)
            ))
            .returning();

        if (deleted.length === 0) {
            throw new NotFoundError('Role assignment not found');
        }

        return { message: 'Role removed from user' };
    }

    /**
     * Get all marketplaces with configs
     */
    static async getMarketplaces() {
        return db.query.marketplaces.findMany({
            with: {
                configs: true,
            },
        });
    }

    /**
     * Update marketplace config
     */
    static async updateMarketplaceConfig(
        marketplaceId: number,
        config: Record<string, unknown>
    ) {
        const existing = await db.query.marketplaceConfigs.findFirst({
            where: eq(marketplaceConfigs.marketplaceId, marketplaceId),
        });

        if (!existing) {
            throw new NotFoundError('Marketplace config not found');
        }

        // Merge existing config with updates
        const updatedConfig = { ...(existing.config as object), ...config };

        await db
            .update(marketplaceConfigs)
            .set({ config: updatedConfig, updatedAt: new Date() })
            .where(eq(marketplaceConfigs.id, existing.id));

        return { marketplaceId, config: updatedConfig };
    }

    /**
     * Get subscription plans
     */
    static async getSubscriptionPlans() {
        return db.query.subscriptionPlans.findMany({
            orderBy: [subscriptionPlans.price],
        });
    }

    /**
     * Get recent activity (for admin dashboard)
     */
    static async getRecentActivity(_limit = 20) {
        const [recentUsers, recentProducts, recentTransactions] = await Promise.all([
            db.query.users.findMany({
                limit: 5,
                orderBy: [desc(users.createdAt)],
                with: { profile: true },
            }),
            db.query.products.findMany({
                limit: 5,
                orderBy: [desc(products.createdAt)],
                with: { user: true },
            }),
            db.query.creditTransactions.findMany({
                limit: 10,
                orderBy: [desc(creditTransactions.createdAt)],
                with: { user: true },
            }),
        ]);

        return {
            recentUsers: recentUsers.map(u => ({
                id: u.id,
                email: u.email,
                name: `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim(),
                createdAt: u.createdAt,
            })),
            recentProducts: recentProducts.map(p => ({
                id: p.id,
                userId: p.userId,
                userEmail: p.user?.email,
                status: p.productStatus,
                createdAt: p.createdAt,
            })),
            recentTransactions,
        };
    }
}
