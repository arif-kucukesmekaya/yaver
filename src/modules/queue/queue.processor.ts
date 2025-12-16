import { db } from '../../core/database';
import { imageProcessingQueue, aiEnhancedImages, products, generationErrors } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { AIService, ImageType } from '../ai/ai.service';


export class QueueProcessor {
    private isProcessing = false;
    private pollInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.start();
    }

    start() {
        console.log('🔄 AI Queue Processor initialized.');
        // ⚡ Poll every 1 second for faster response
        this.pollInterval = setInterval(() => this.process(), 1000);
    }

    async process() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            // 1. Find the oldest pending job
            const job = await db.query.imageProcessingQueue.findFirst({
                where: eq(imageProcessingQueue.status, 'pending'),
                orderBy: (jobs, { asc }) => [asc(jobs.createdAt)],
                with: {
                    product: {
                        with: {
                            sourceImages: true,  // ✅ Include source images for image-to-image
                        }
                    },
                }
            });


            if (!job) {
                this.isProcessing = false;
                return;
            }

            console.log(`⚙️ Processing Job #${job.id} (Product: ${job.product?.brandName || 'Unknown'})`);

            // 2. Mark as processing
            await db.update(imageProcessingQueue)
                .set({ status: 'processing', updatedAt: new Date() })
                .where(eq(imageProcessingQueue.id, job.id));

            // 3. ⚡ Generate 3 variants IN PARALLEL (3x faster!)
            const types: ImageType[] = ['lifestyle', 'infographic', 'detail'];

            const imagePromises = types.map(async (type) => {
                try {
                    console.log(`   > Generating ${type} image...`);
                    const result = await AIService.generateProductImage(job.product, type);

                    if (result && result.url) {
                        await db.insert(aiEnhancedImages).values({
                            productId: job.productId,
                            imageUrl: result.url,
                            imageType: result.type,
                            prompt: result.prompt,
                            status: 'completed',
                            metadata: {
                                provider: 'fal-ai/nano-banana-pro',
                                mode: result.mode || 'text-to-image',
                                generatedAt: new Date().toISOString()
                            }
                        });
                        console.log(`   ✅ ${type} image generated successfully`);
                        return { type, success: true };
                    }
                    return { type, success: false, error: 'No URL returned' };
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    console.error(`   ❌ Failed to generate ${type}: `, errorMessage);

                    // 🔥 Log to generation_errors table
                    await db.insert(generationErrors).values({
                        productId: job.productId,
                        errorType: 'image_generation',
                        errorMessage: `Failed to generate ${type} image: ${errorMessage}`,
                        resolved: false
                    });

                    return { type, success: false, error: errorMessage };
                }
            });


            // Wait for all images to complete in parallel
            const results = await Promise.all(imagePromises);

            // 4. Mark job as completed
            await db.update(imageProcessingQueue)
                .set({ status: 'completed', updatedAt: new Date() })
                .where(eq(imageProcessingQueue.id, job.id));

            // 5. ✅ Update Product Status Based on Results
            const successfulImages = results.filter(r => r.success).length;
            const failedImages = results.filter(r => !r.success);

            if (job.product) {
                if (successfulImages === 3) {
                    // ✅ Perfect - All 3 images generated
                    await db.update(products)
                        .set({ productStatus: 'completed', updatedAt: new Date() })
                        .where(eq(products.id, job.productId));
                    console.log(`✅ Job #${job.id} completed - Product status: COMPLETED(3 / 3 images)`);

                } else if (successfulImages > 0) {
                    // ⚠️ Partial Success - Some images failed
                    console.log(`⚠️ Job #${job.id} partially successful(${successfulImages} / 3 images)`);

                    // Log partial failure to errors table
                    const failedTypes = failedImages.map(f => f.type).join(', ');
                    await db.insert(generationErrors).values({
                        productId: job.productId,
                        errorType: 'partial_generation',
                        errorMessage: `Only ${successfulImages}/3 images generated. Failed: ${failedTypes}`,
                        resolved: false
                    });

                    // Keep status as processing (user can retry)
                    await db.update(products)
                        .set({
                            productStatus: 'failed',
                            updatedAt: new Date()
                        })
                        .where(eq(products.id, job.productId));

                } else {
                    // ❌ Complete Failure - No images generated
                    await db.update(products)
                        .set({ productStatus: 'failed', updatedAt: new Date() })
                        .where(eq(products.id, job.productId));

                    console.log(`❌ Job #${job.id} FAILED - No images generated`);

                    // Log complete failure
                    await db.insert(generationErrors).values({
                        productId: job.productId,
                        errorType: 'complete_generation_failure',
                        errorMessage: 'Failed to generate any images for this product',
                        resolved: false
                    });
                }
            }


        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('💥 Queue Processor Critical Error:', errorMessage);

            // Log critical system error (skip if no product context)
            console.error('Critical queue error - skipping database log due to schema constraints');
        } finally {
            this.isProcessing = false;
        }
    }

    stop() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log('🛑 Queue Processor stopped');
        }
    }
}
