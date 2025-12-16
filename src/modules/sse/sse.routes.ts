import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { db } from '../../core/database';
import { products } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { verify } from 'hono/jwt';

const sseRoutes = new Hono();

// SSE endpoint for product updates (with token query param support for EventSource)
sseRoutes.get('/products/:id/updates', async (c) => {
    // EventSource doesn't support custom headers, so we accept token as query param
    const tokenFromQuery = c.req.query('token');

    if (!tokenFromQuery) {
        return c.json({ error: 'Token required' }, 401);
    }

    // Verify JWT token
    let user;
    try {
        const secret = process.env['JWT_SECRET'] || 'your-secret-key';
        const payload = await verify(tokenFromQuery, secret);
        // ✅ FIX: Ensure userId is NUMBER (JWT payload might return string)
        const userId = typeof payload['userId'] === 'string'
            ? parseInt(payload['userId'])
            : Number(payload['userId']);
        user = { id: userId };
        console.log('✅ SSE Auth Success - User ID:', userId);
    } catch (error) {
        console.error('❌ SSE Auth Error:', error);
        return c.json({ error: 'Invalid token' }, 401);
    }

    const productId = parseInt(c.req.param('id'));

    if (isNaN(productId)) {
        return c.json({ error: 'Invalid product ID' }, 400);
    }

    // Verify ownership
    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
    });

    if (!product || product.userId !== user.id) {
        return c.json({ error: 'Not authorized' }, 403);
    }

    return streamSSE(c, async (stream) => {
        let lastStatus = product.productStatus;
        let lastImageCount = 0;

        // Poll database and send updates every second
        const interval = setInterval(async () => {
            try {
                const updatedProduct = await db.query.products.findFirst({
                    where: eq(products.id, productId),
                    with: {
                        enhancedImages: true,
                        listings: {
                            with: {
                                marketplace: true,
                            },
                        },
                    },
                });

                if (!updatedProduct) {
                    clearInterval(interval);
                    await stream.close();
                    return;
                }

                // Check if status changed
                if (updatedProduct.productStatus !== lastStatus) {
                    lastStatus = updatedProduct.productStatus;
                    await stream.writeSSE({
                        event: 'status',
                        data: JSON.stringify({
                            status: updatedProduct.productStatus,
                            timestamp: new Date().toISOString(),
                        }),
                    });
                }

                // Check if images were added
                const currentImageCount = updatedProduct.enhancedImages?.length || 0;
                if (currentImageCount > lastImageCount) {
                    lastImageCount = currentImageCount;
                    await stream.writeSSE({
                        event: 'image',
                        data: JSON.stringify({
                            count: currentImageCount,
                            images: updatedProduct.enhancedImages,
                            timestamp: new Date().toISOString(),
                        }),
                    });
                }

                // If complete, send final update and close
                if (updatedProduct.productStatus === 'completed') {
                    await stream.writeSSE({
                        event: 'complete',
                        data: JSON.stringify({
                            product: updatedProduct,
                            timestamp: new Date().toISOString(),
                        }),
                    });
                    clearInterval(interval);
                    await stream.close();
                }
            } catch (error) {
                console.error('SSE Error:', error);
                clearInterval(interval);
                await stream.close();
            }
        }, 1000); // Check every second

        // Clean up on client disconnect
        c.req.raw.signal.addEventListener('abort', () => {
            clearInterval(interval);
        });
    });
});

export default sseRoutes;
