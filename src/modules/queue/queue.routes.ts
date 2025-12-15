import { Hono } from 'hono';
import { authMiddleware } from '../../core/middleware/auth';
import { db } from '../../core/database';
import { imageProcessingQueue, products } from '../../core/database/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

const queueRoutes = new Hono();

// Apply auth middleware
queueRoutes.use('*', authMiddleware);

// GET /queue/status - Get queue stats for current user
queueRoutes.get('/status', async (c) => {
    const user = c.get('user');

    // Get user's product IDs
    const userProducts = await db.query.products.findMany({
        where: eq(products.userId, user.id),
        columns: { id: true },
    });

    const productIds = userProducts.map(p => p.id);

    if (productIds.length === 0) {
        return c.json({
            success: true,
            data: {
                pending: 0,
                processing: 0,
                completed: 0,
                failed: 0,
                total: 0,
            },
            timestamp: new Date().toISOString(),
        });
    }

    // Count by status
    const stats = await db
        .select({
            status: imageProcessingQueue.status,
            count: count(),
        })
        .from(imageProcessingQueue)
        .where(sql`${imageProcessingQueue.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`)
        .groupBy(imageProcessingQueue.status);

    const result = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        total: 0,
    };

    stats.forEach(s => {
        const statusKey = s.status as keyof typeof result;
        if (statusKey in result) {
            result[statusKey] = Number(s.count);
        }
        result.total += Number(s.count);
    });

    return c.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
    });
});

// GET /queue/items - Get recent queue items
queueRoutes.get('/items', async (c) => {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '10');

    // Get user's products with queue items
    const userProducts = await db.query.products.findMany({
        where: eq(products.userId, user.id),
        columns: { id: true },
    });

    const productIds = userProducts.map(p => p.id);

    if (productIds.length === 0) {
        return c.json({
            success: true,
            data: [],
            timestamp: new Date().toISOString(),
        });
    }

    const items = await db.query.imageProcessingQueue.findMany({
        where: sql`${imageProcessingQueue.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`,
        orderBy: [desc(imageProcessingQueue.createdAt)],
        limit,
        with: {
            product: {
                columns: {
                    id: true,
                    brandName: true,
                },
            },
        },
    });

    return c.json({
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
    });
});

export { queueRoutes };
export default queueRoutes;
