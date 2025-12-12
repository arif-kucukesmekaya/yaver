import { Hono } from 'hono';
import { db } from '../../core/database';
import { marketplaces } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

const marketplaceRoutes = new Hono();

// GET /marketplaces - Get all marketplaces
marketplaceRoutes.get('/', async (c) => {
  const allMarketplaces = await db.query.marketplaces.findMany({
    with: {
      configs: true,
    },
    orderBy: (marketplaces, { asc }) => [asc(marketplaces.name)],
  });

  return c.json({
    success: true,
    data: allMarketplaces,
    timestamp: new Date().toISOString(),
  });
});

// GET /marketplaces/:id - Get single marketplace
marketplaceRoutes.get('/:id', async (c) => {
  const marketplaceId = parseInt(c.req.param('id'));

  if (isNaN(marketplaceId)) {
    throw new NotFoundError('Invalid marketplace ID');
  }

  const marketplace = await db.query.marketplaces.findFirst({
    where: eq(marketplaces.id, marketplaceId),
    with: {
      configs: true,
    },
  });

  if (!marketplace) {
    throw new NotFoundError('Marketplace not found');
  }

  return c.json({
    success: true,
    data: marketplace,
    timestamp: new Date().toISOString(),
  });
});

export { marketplaceRoutes };

export default marketplaceRoutes;
