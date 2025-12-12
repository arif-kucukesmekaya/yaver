import { Hono } from 'hono';
import { db } from '../../core/database';
import { categories } from '../../core/database/schema';
import { eq, isNull } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

const categoryRoutes = new Hono();

// Helper function to build category tree
const buildCategoryTree = async (parentId: number | null = null): Promise<any[]> => {
  const cats = await db.query.categories.findMany({
    where: parentId === null 
      ? isNull(categories.parentId) 
      : eq(categories.parentId, parentId),
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  const tree = await Promise.all(
    cats.map(async (cat) => {
      const children = await buildCategoryTree(cat.id);
      return {
        ...cat,
        children,
      };
    })
  );

  return tree;
};

// GET /categories - Get all categories as tree
categoryRoutes.get('/', async (c) => {
  const tree = await buildCategoryTree();

  return c.json({
    success: true,
    data: tree,
    timestamp: new Date().toISOString(),
  });
});

// GET /categories/top - Get top-level categories only
categoryRoutes.get('/top', async (c) => {
  const topCategories = await db.query.categories.findMany({
    where: isNull(categories.parentId),
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  return c.json({
    success: true,
    data: topCategories,
    timestamp: new Date().toISOString(),
  });
});

// GET /categories/:id - Get single category
categoryRoutes.get('/:id', async (c) => {
  const categoryId = parseInt(c.req.param('id'));

  if (isNaN(categoryId)) {
    throw new NotFoundError('Invalid category ID');
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return c.json({
    success: true,
    data: category,
    timestamp: new Date().toISOString(),
  });
});

// GET /categories/:id/children - Get child categories
categoryRoutes.get('/:id/children', async (c) => {
  const categoryId = parseInt(c.req.param('id'));

  if (isNaN(categoryId)) {
    throw new NotFoundError('Invalid category ID');
  }

  // Verify parent category exists
  const parentCategory = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });

  if (!parentCategory) {
    throw new NotFoundError('Category not found');
  }

  // Get children
  const children = await db.query.categories.findMany({
    where: eq(categories.parentId, categoryId),
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  return c.json({
    success: true,
    data: children,
    timestamp: new Date().toISOString(),
  });
});

export { categoryRoutes };

export default categoryRoutes;
