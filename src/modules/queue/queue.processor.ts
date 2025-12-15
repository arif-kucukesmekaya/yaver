
import { db } from '../../core/database';
import { imageProcessingQueue, aiEnhancedImages, products } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { AIService, ImageType } from '../ai/ai.service';
import { productStatusEnum } from '../../core/database/schema';

export class QueueProcessor {
    private isProcessing = false;
    private pollInterval: Timer | null = null; // Bun specific Timer type or generic

    constructor() {
        this.start();
    }

    start() {
        console.log('🔄 AI Queue Processor initialized.');
        // Poll every 5 seconds
        this.pollInterval = setInterval(() => this.process(), 5000);
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
                    product: true,
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

            // 3. Generate 3 variants
            const types: ImageType[] = ['lifestyle', 'infographic', 'detail'];

            // Generate in parallel to be faster? Or sequential to avoid rate limits?
            // Gemini has limits. Sequential is safer.

            for (const type of types) {
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
                                generatedAt: new Date().toISOString()
                            }
                        });
                    }
                } catch (err) {
                    console.error(`   ❌ Failed to generate ${type}:`, err);
                    // Don't fail the whole job, partial success is okay?
                }
            }

            // 4. Mark job as completed
            await db.update(imageProcessingQueue)
                .set({ status: 'completed', updatedAt: new Date() })
                .where(eq(imageProcessingQueue.id, job.id));

            // Also update Product status to 'completed' if it was 'processing'
            if (job.product) {
                await db.update(products)
                    .set({ productStatus: 'completed', updatedAt: new Date() })
                    .where(eq(products.id, job.productId));
            }

            console.log(`✅ Job #${job.id} finished successfully.`);

        } catch (error) {
            console.error('💥 Queue Processor Critical Error:', error);
        } finally {
            this.isProcessing = false;
        }
    }
}
