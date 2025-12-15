import { Hono } from 'hono';
import { authMiddleware } from '../../core/middleware/auth';
import { db } from '../../core/database';
import { generationErrors, products } from '../../core/database/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

const errorsRoutes = new Hono();

// Apply auth middleware
errorsRoutes.use('*', authMiddleware);

// GET /errors - Get generation errors for current user
errorsRoutes.get('/', async (c) => {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '20');
    const unresolvedOnly = c.req.query('unresolved') === 'true';

    // Get user's product IDs
    const userProducts = await db.query.products.findMany({
        where: eq(products.userId, user.id),
        columns: { id: true },
    });

    const productIds = userProducts.map(p => p.id);

    if (productIds.length === 0) {
        return c.json({
            success: true,
            data: [],
            stats: { total: 0, unresolved: 0 },
            timestamp: new Date().toISOString(),
        });
    }

    // Build where clause
    let whereClause = sql`${generationErrors.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`;
    if (unresolvedOnly) {
        whereClause = sql`${whereClause} AND ${generationErrors.resolved} = false`;
    }

    const errors = await db.query.generationErrors.findMany({
        where: whereClause,
        orderBy: [desc(generationErrors.createdAt)],
        limit,
        with: {
            product: {
                columns: {
                    id: true,
                    brandName: true,
                },
            },
            marketplace: {
                columns: {
                    id: true,
                    name: true,
                    logoUrl: true,
                },
            },
        },
    });

    // Get stats
    const [statsResult] = await db
        .select({
            total: count(),
            unresolved: sql`SUM(CASE WHEN ${generationErrors.resolved} = false THEN 1 ELSE 0 END)`,
        })
        .from(generationErrors)
        .where(sql`${generationErrors.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`);

    return c.json({
        success: true,
        data: errors,
        stats: {
            total: Number(statsResult?.total || 0),
            unresolved: Number(statsResult?.unresolved || 0),
        },
        timestamp: new Date().toISOString(),
    });
});

// PATCH /errors/:id/resolve - Mark error as resolved
errorsRoutes.patch('/:id/resolve', async (c) => {
    const user = c.get('user');
    const errorId = parseInt(c.req.param('id'));

    if (isNaN(errorId)) {
        throw new NotFoundError('Invalid error ID');
    }

    // Verify error belongs to user's product
    const error = await db.query.generationErrors.findFirst({
        where: eq(generationErrors.id, errorId),
        with: {
            product: {
                columns: {
                    userId: true,
                },
            },
        },
    });

    if (!error || error.product?.userId !== user.id) {
        throw new NotFoundError('Error not found');
    }

    // Mark as resolved
    await db
        .update(generationErrors)
        .set({ resolved: true, updatedAt: new Date() })
        .where(eq(generationErrors.id, errorId));

    return c.json({
        success: true,
        message: 'Error marked as resolved',
        timestamp: new Date().toISOString(),
    });
});

export { errorsRoutes };
export default errorsRoutes;
