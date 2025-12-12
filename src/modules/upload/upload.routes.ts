import { Hono } from 'hono';
import { authMiddleware } from '../../core/middleware/auth';
import { upload } from '../../core/middleware/upload';
import { db } from '../../core/database';
import { productSourceImages } from '../../core/database/schema';
import { ValidationError } from '../../shared/utils/errors';

const uploadRoutes = new Hono();

// Apply auth middleware
uploadRoutes.use('*', authMiddleware);

// POST /upload/product-image - Upload product image
uploadRoutes.post('/product-image', async (c) => {
  return new Promise<any>((resolve, _reject) => {
    const uploadSingle = upload.single('image');
    
    uploadSingle(c.req.raw as any, {} as any, async (err: any) => {
      if (err) {
        resolve(c.json({
          success: false,
          error: err.message || 'File upload failed',
          timestamp: new Date().toISOString(),
        }, 400));
        return;
      }

      const file = (c.req.raw as any).file;
      
      if (!file) {
        resolve(c.json({
          success: false,
          error: 'No file uploaded',
          timestamp: new Date().toISOString(),
        }, 400));
        return;
      }

      const imageUrl = `/uploads/${file.filename}`;
      
      resolve(c.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: imageUrl,
        },
        timestamp: new Date().toISOString(),
      }, 201));
    });
  });
});

// POST /upload/product-image/:productId - Upload and attach to product
uploadRoutes.post('/product-image/:productId', async (c) => {
  const productId = parseInt(c.req.param('productId'));
  
  if (isNaN(productId)) {
    throw new ValidationError('Invalid product ID');
  }

  return new Promise<any>((resolve, _reject) => {
    const uploadSingle = upload.single('image');
    
    uploadSingle(c.req.raw as any, {} as any, async (err: any) => {
      if (err) {
        resolve(c.json({
          success: false,
          error: err.message || 'File upload failed',
          timestamp: new Date().toISOString(),
        }, 400));
        return;
      }

      const file = (c.req.raw as any).file;
      
      if (!file) {
        resolve(c.json({
          success: false,
          error: 'No file uploaded',
          timestamp: new Date().toISOString(),
        }, 400));
        return;
      }

      const imageUrl = `/uploads/${file.filename}`;

      // Save to database
      const [savedImage] = await db
        .insert(productSourceImages)
        .values({
          productId,
          imageUrl,
        })
        .returning();
      
      if (!savedImage) {
        throw new Error('Failed to save image');
      }

      resolve(c.json({
        success: true,
        message: 'Image uploaded and attached to product',
        data: {
          id: savedImage.id,
          productId: savedImage.productId,
          imageUrl: savedImage.imageUrl,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
        },
        timestamp: new Date().toISOString(),
      }, 201));
    });
  });
});

export { uploadRoutes };

export default uploadRoutes;
