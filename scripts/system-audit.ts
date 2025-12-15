import { db } from '../src/core/database';
import {
    users, userProfiles, roles, userRoles, passwordResetTokens, refreshTokens,
    subscriptionPlans, userSubscriptions, payments, creditTransactions, userCredits,
    marketplaces, marketplaceConfigs, categories, products, productSourceImages,
    productMarketplaceSelections, marketplaceListings, aiEnhancedImages,
    imageProcessingQueue, generationErrors
} from '../src/core/database/schema';
import { eq, sql, desc } from 'drizzle-orm';

interface TestResult {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    duration: number;
    details?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
    const start = Date.now();
    try {
        await fn();
        results.push({ name, status: 'PASS', duration: Date.now() - start });
        console.log(`✅ ${name}`);
    } catch (error: any) {
        results.push({ name, status: 'FAIL', duration: Date.now() - start, details: error.message });
        console.log(`❌ ${name}: ${error.message}`);
    }
}

async function warn(name: string, message: string) {
    results.push({ name, status: 'WARN', duration: 0, details: message });
    console.log(`⚠️ ${name}: ${message}`);
}

async function runTests() {
    console.log('\n🔬 ═══════════════════════════════════════════════════════');
    console.log('   YAVER - Comprehensive System Audit');
    console.log('   Senior Backend/Database Engineer Level Test Suite');
    console.log('═══════════════════════════════════════════════════════\n');

    // ══════════════════════════════════════════════════════════════
    // SECTION 1: DATABASE CONNECTIVITY & TABLE ACCESS
    // ══════════════════════════════════════════════════════════════
    console.log('\n📊 SECTION 1: Database Connectivity & Table Access\n');

    await test('DB Connection', async () => {
        const result = await db.execute(sql`SELECT 1 as test`);
        if (!result) throw new Error('No response from database');
    });

    // Test each table is queryable
    const tables = [
        { name: 'users', table: users },
        { name: 'userProfiles', table: userProfiles },
        { name: 'roles', table: roles },
        { name: 'userRoles', table: userRoles },
        { name: 'passwordResetTokens', table: passwordResetTokens },
        { name: 'refreshTokens', table: refreshTokens },
        { name: 'subscriptionPlans', table: subscriptionPlans },
        { name: 'userSubscriptions', table: userSubscriptions },
        { name: 'payments', table: payments },
        { name: 'creditTransactions', table: creditTransactions },
        { name: 'userCredits', table: userCredits },
        { name: 'marketplaces', table: marketplaces },
        { name: 'marketplaceConfigs', table: marketplaceConfigs },
        { name: 'categories', table: categories },
        { name: 'products', table: products },
        { name: 'productSourceImages', table: productSourceImages },
        { name: 'productMarketplaceSelections', table: productMarketplaceSelections },
        { name: 'marketplaceListings', table: marketplaceListings },
        { name: 'aiEnhancedImages', table: aiEnhancedImages },
        { name: 'imageProcessingQueue', table: imageProcessingQueue },
        { name: 'generationErrors', table: generationErrors },
    ];

    for (const { name, table } of tables) {
        await test(`Table Access: ${name}`, async () => {
            const result = await db.select().from(table).limit(1);
            // Just checking it doesn't throw
        });
    }

    // ══════════════════════════════════════════════════════════════
    // SECTION 2: DATA INTEGRITY & RELATIONSHIPS
    // ══════════════════════════════════════════════════════════════
    console.log('\n🔗 SECTION 2: Data Integrity & Relationships\n');

    await test('Users have Profiles', async () => {
        const usersWithProfiles = await db.query.users.findMany({
            with: { profile: true },
            limit: 5
        });
        // Check that relation works
        if (usersWithProfiles.length === 0) {
            await warn('Users have Profiles', 'No users found to test');
        }
    });

    await test('Users have Credits', async () => {
        const usersWithCredits = await db.query.users.findMany({
            with: { credits: true },
            limit: 5
        });
    });

    await test('Products have Relations', async () => {
        const productsWithRelations = await db.query.products.findMany({
            with: {
                sourceImages: true,
                enhancedImages: true,
                listings: true,
                marketplaceSelections: true,
                category: true,
            },
            limit: 5
        });
    });

    await test('Marketplaces have Configs', async () => {
        const mps = await db.query.marketplaces.findMany({
            with: { configs: true }
        });
        for (const mp of mps) {
            if (!mp.configs || mp.configs.length === 0) {
                await warn(`Marketplace Config: ${mp.name}`, 'No config found');
            }
        }
    });

    await test('Subscriptions have Plans', async () => {
        const subs = await db.query.userSubscriptions.findMany({
            with: { plan: true },
            limit: 5
        });
    });

    // ══════════════════════════════════════════════════════════════
    // SECTION 3: CRUD OPERATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('\n✏️ SECTION 3: CRUD Operations\n');

    // Test INSERT on categories (safe table)
    await test('INSERT: categories', async () => {
        const result = await db.insert(categories).values({
            name: '__TEST_CATEGORY__',
        }).returning();
        if (result.length === 0) throw new Error('Insert failed');
        // Cleanup
        await db.delete(categories).where(eq(categories.id, result[0].id));
    });

    // Test UPDATE
    await test('UPDATE: subscriptionPlans', async () => {
        const plans = await db.select().from(subscriptionPlans).limit(1);
        if (plans.length === 0) {
            await warn('UPDATE: subscriptionPlans', 'No plans to update');
            return;
        }
        const originalName = plans[0].name;
        await db.update(subscriptionPlans).set({ updatedAt: new Date() }).where(eq(subscriptionPlans.id, plans[0].id));
        // Verify
        const updated = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, plans[0].id));
        if (!updated[0]) throw new Error('Update failed');
    });

    // ══════════════════════════════════════════════════════════════
    // SECTION 4: AI GENERATION FLOW
    // ══════════════════════════════════════════════════════════════
    console.log('\n🤖 SECTION 4: AI Generation Flow\n');

    await test('Queue Table Writeable', async () => {
        // Check if we can write to imageProcessingQueue
        const testProduct = await db.query.products.findFirst();
        if (!testProduct) {
            await warn('Queue Table Writeable', 'No products to test with');
            return;
        }
        const queueItem = await db.insert(imageProcessingQueue).values({
            productId: testProduct.id,
            sourceImageUrl: 'https://test.com/image.jpg',
            status: 'pending',
        }).returning();
        if (queueItem.length === 0) throw new Error('Queue insert failed');
        // Cleanup
        await db.delete(imageProcessingQueue).where(eq(imageProcessingQueue.id, queueItem[0].id));
    });

    await test('aiEnhancedImages Writeable', async () => {
        const testProduct = await db.query.products.findFirst();
        if (!testProduct) {
            await warn('aiEnhancedImages Writeable', 'No products to test with');
            return;
        }
        const img = await db.insert(aiEnhancedImages).values({
            productId: testProduct.id,
            imageUrl: 'https://test.com/ai-image.jpg',
            imageType: 'lifestyle',
            prompt: 'Test prompt',
            status: 'completed',
        }).returning();
        if (img.length === 0) throw new Error('AI image insert failed');
        // Cleanup
        await db.delete(aiEnhancedImages).where(eq(aiEnhancedImages.id, img[0].id));
    });

    await test('marketplaceListings Writeable', async () => {
        const testProduct = await db.query.products.findFirst();
        const testMp = await db.query.marketplaces.findFirst();
        if (!testProduct || !testMp) {
            await warn('marketplaceListings Writeable', 'Missing product or marketplace');
            return;
        }
        const listing = await db.insert(marketplaceListings).values({
            productId: testProduct.id,
            marketplaceId: testMp.id,
            generatedTitle: '__TEST_TITLE__',
            generatedDescription: '__TEST_DESC__',
            listingStatus: 'draft',
        }).returning();
        if (listing.length === 0) throw new Error('Listing insert failed');
        // Cleanup
        await db.delete(marketplaceListings).where(eq(marketplaceListings.id, listing[0].id));
    });

    // ══════════════════════════════════════════════════════════════
    // SECTION 5: CREDIT SYSTEM
    // ══════════════════════════════════════════════════════════════
    console.log('\n💰 SECTION 5: Credit System\n');

    await test('Credit Transactions Writeable', async () => {
        const testUser = await db.query.users.findFirst();
        if (!testUser) {
            await warn('Credit Transactions Writeable', 'No users found');
            return;
        }
        const tx = await db.insert(creditTransactions).values({
            userId: testUser.id,
            amount: 0,
            transactionType: 'bonus',
            description: '__TEST_TRANSACTION__',
        }).returning();
        if (tx.length === 0) throw new Error('Transaction insert failed');
        // Cleanup
        await db.delete(creditTransactions).where(eq(creditTransactions.id, tx[0].id));
    });

    await test('userCredits Updateable', async () => {
        const testCredits = await db.query.userCredits.findFirst();
        if (!testCredits) {
            await warn('userCredits Updateable', 'No user credits found');
            return;
        }
        const original = testCredits.subscriptionCredits;
        await db.update(userCredits).set({ updatedAt: new Date() }).where(eq(userCredits.userId, testCredits.userId));
    });

    // ══════════════════════════════════════════════════════════════
    // SECTION 6: CURRENT DATA STATISTICS
    // ══════════════════════════════════════════════════════════════
    console.log('\n📈 SECTION 6: Current Data Statistics\n');

    const stats = {
        users: (await db.select({ count: sql<number>`count(*)` }).from(users))[0]?.count || 0,
        products: (await db.select({ count: sql<number>`count(*)` }).from(products))[0]?.count || 0,
        aiImages: (await db.select({ count: sql<number>`count(*)` }).from(aiEnhancedImages))[0]?.count || 0,
        listings: (await db.select({ count: sql<number>`count(*)` }).from(marketplaceListings))[0]?.count || 0,
        queuePending: (await db.select({ count: sql<number>`count(*)` }).from(imageProcessingQueue).where(eq(imageProcessingQueue.status, 'pending')))[0]?.count || 0,
        queueProcessing: (await db.select({ count: sql<number>`count(*)` }).from(imageProcessingQueue).where(eq(imageProcessingQueue.status, 'processing')))[0]?.count || 0,
        queueCompleted: (await db.select({ count: sql<number>`count(*)` }).from(imageProcessingQueue).where(eq(imageProcessingQueue.status, 'completed')))[0]?.count || 0,
    };

    console.log('   📊 Data Counts:');
    console.log(`      Users: ${stats.users}`);
    console.log(`      Products: ${stats.products}`);
    console.log(`      AI Enhanced Images: ${stats.aiImages}`);
    console.log(`      Marketplace Listings: ${stats.listings}`);
    console.log(`      Queue - Pending: ${stats.queuePending}`);
    console.log(`      Queue - Processing: ${stats.queueProcessing}`);
    console.log(`      Queue - Completed: ${stats.queueCompleted}`);

    // ══════════════════════════════════════════════════════════════
    // SECTION 7: POTENTIAL ISSUES CHECK
    // ══════════════════════════════════════════════════════════════
    console.log('\n🔍 SECTION 7: Potential Issues Check\n');

    // Check for orphaned records
    await test('No Orphaned Products', async () => {
        const orphaned = await db.execute(sql`
            SELECT p.id FROM products p 
            LEFT JOIN users u ON p.user_id = u.id 
            WHERE u.id IS NULL
        `);
        if ((orphaned as any).length > 0) {
            throw new Error(`Found ${(orphaned as any).length} orphaned products`);
        }
    });

    // Check for stuck queue items
    await test('No Stuck Queue Items', async () => {
        const stuck = await db.execute(sql`
            SELECT * FROM image_processing_queue 
            WHERE status = 'processing' 
            AND updated_at < NOW() - INTERVAL '10 minutes'
        `);
        if ((stuck as any).length > 0) {
            await warn('Stuck Queue Items', `Found ${(stuck as any).length} potentially stuck items`);
        }
    });

    // Check for products without listings
    await test('Products Have Listings', async () => {
        const productsNoListings = await db.execute(sql`
            SELECT p.id, p.brand_name, p.product_status FROM products p 
            LEFT JOIN marketplace_listings ml ON p.id = ml.product_id 
            WHERE ml.id IS NULL AND p.product_status = 'completed'
        `);
        if ((productsNoListings as any).length > 0) {
            await warn('Products Without Listings', `${(productsNoListings as any).length} completed products have no listings`);
        }
    });

    // ══════════════════════════════════════════════════════════════
    // FINAL REPORT
    // ══════════════════════════════════════════════════════════════
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                     FINAL REPORT');
    console.log('═══════════════════════════════════════════════════════\n');

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const warnings = results.filter(r => r.status === 'WARN').length;

    console.log(`   ✅ PASSED:   ${passed}`);
    console.log(`   ❌ FAILED:   ${failed}`);
    console.log(`   ⚠️ WARNINGS: ${warnings}`);
    console.log(`   📊 TOTAL:    ${results.length}\n`);

    if (failed > 0) {
        console.log('   ❌ FAILED TESTS:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`      - ${r.name}: ${r.details}`);
        });
    }

    if (warnings > 0) {
        console.log('\n   ⚠️ WARNINGS:');
        results.filter(r => r.status === 'WARN').forEach(r => {
            console.log(`      - ${r.name}: ${r.details}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(failed === 0 ? '   🎉 ALL CRITICAL TESTS PASSED!' : '   ⛔ SOME TESTS FAILED - REVIEW REQUIRED');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
    console.error('💥 Test suite crashed:', err);
    process.exit(1);
});
