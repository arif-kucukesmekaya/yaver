import { db } from "../src/core/database/original";
import * as schema from "../src/core/database/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/shared/utils/password";

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // 1. Marketplaces ekle
    console.log("📦 Seeding marketplaces...");
    const [trendyol, hepsiburada, amazon] = await db
      .insert(schema.marketplaces)
      .values([
        {
          name: "Trendyol",
          apiBaseUrl: "https://api.trendyol.com",
          logoUrl: "/logos/trendyol.png",
        },
        {
          name: "Hepsiburada",
          apiBaseUrl: "https://api.hepsiburada.com",
          logoUrl: "/logos/hepsiburada.png",
        },
        {
          name: "Amazon",
          apiBaseUrl: "https://api.amazon.com",
          logoUrl: "/logos/amazon.png",
        },
      ])
      .returning();

    // 2. Marketplace Configs ekle (JSONB)
    console.log("⚙️ Seeding marketplace configs...");
    await db.insert(schema.marketplaceConfigs).values([
      {
        marketplaceId: trendyol.id,
        config: {
          max_title_length: 100,
          description_max_length: 3000,
          language: "tr",
          banned_words: ["garanti", "kesin", "en iyi"],
          format: "plain_text",
          seo_keywords_required: true,
          credit_cost: 1,
        },
      },
      {
        marketplaceId: hepsiburada.id,
        config: {
          max_title_length: 150,
          description_max_length: 5000,
          language: "tr",
          banned_words: ["garantili", "kesinlikle"],
          format: "html",
          seo_keywords_required: true,
          credit_cost: 1,
        },
      },
      {
        marketplaceId: amazon.id,
        config: {
          max_title_length: 200,
          description_format: "html",
          language: "en",
          bullet_points: true,
          bullet_point_max: 5,
          keyword_density: 0.05,
          a_plus_content_supported: true,
          credit_cost: 2,
        },
      },
    ]);

    // 3. Roles ekle
    console.log("👥 Seeding roles...");
    const [adminRole, sellerRole] = await db
      .insert(schema.roles)
      .values([
        { roleName: "Admin" },
        { roleName: "Satıcı" },
        { roleName: "Editör" },
      ])
      .returning();

    // 4. Subscription Plans ekle
    console.log("💳 Seeding subscription plans...");
    const [freePlan, proPlan, enterprisePlan] = await db
      .insert(schema.subscriptionPlans)
      .values([
        {
          name: "Free",
          price: 0,
          monthlyCreditLimit: 10,
        },
        {
          name: "Pro",
          price: 299,
          monthlyCreditLimit: 100,
        },
        {
          name: "Enterprise",
          price: 999,
          monthlyCreditLimit: 500,
        },
      ])
      .returning();

    // 5. Demo kullanıcı ekle (şifre: demo123)
    console.log("👤 Seeding demo user...");
    const hashedPassword = await hashPassword("demo123");
    const [demoUser] = await db
      .insert(schema.users)
      .values({
        email: "demo@sellerai.com",
        passwordHash: hashedPassword,
      })
      .returning();

    // 6. User profile ekle
    await db.insert(schema.userProfiles).values({
      userId: demoUser.id,
      firstName: "Demo",
      lastName: "User",
      phoneNumber: "+905551234567",
      companyName: "SellerAI Demo",
    });

    // 7. User role ekle
    await db.insert(schema.userRoles).values({
      userId: demoUser.id,
      roleId: sellerRole.id,
    });

    // 8. User subscription ekle
    const [subscription] = await db
      .insert(schema.userSubscriptions)
      .values({
        userId: demoUser.id,
        planId: freePlan.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
        isActive: true,
      })
      .returning();

    // 9. User credits ekle (trigger test için manuel de ekleyebiliriz)
    await db.insert(schema.userCredits).values({
      userId: demoUser.id,
      availableCredits: freePlan.monthlyCreditLimit,
      totalEarned: freePlan.monthlyCreditLimit,
      totalSpent: 0,
      lastRefillDate: new Date(),
    });

    // 10. İlk kredi transaction ekle (trigger test)
    console.log("💰 Testing credit trigger...");
    await db.insert(schema.creditTransactions).values({
      userId: demoUser.id,
      amount: freePlan.monthlyCreditLimit,
      transactionType: "monthly_refill",
      description: "Initial monthly credit allocation",
    });

    // 11. Kategoriler ekle
    console.log("📂 Seeding categories...");
    const [elektronik, moda, ev] = await db
      .insert(schema.categories)
      .values([
        { name: "Elektronik", parentId: null },
        { name: "Moda", parentId: null },
        { name: "Ev & Yaşam", parentId: null },
      ])
      .returning();

    // Alt kategoriler
    await db.insert(schema.categories).values([
      { name: "Telefonlar", parentId: elektronik.id },
      { name: "Bilgisayarlar", parentId: elektronik.id },
      { name: "Erkek Giyim", parentId: moda.id },
      { name: "Kadın Giyim", parentId: moda.id },
      { name: "Mobilya", parentId: ev.id },
    ]);

    // 12. Demo ürün ekle
    console.log("📦 Seeding demo product...");
    const [demoProduct] = await db
      .insert(schema.products)
      .values({
        userId: demoUser.id,
        categoryId: elektronik.id,
        brandName: "Samsung",
        rawUserPrompt: "Samsung Galaxy S24 Ultra, 12GB RAM, 256GB, Titanium Black",
        productStatus: "draft",
      })
      .returning();

    console.log("✅ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- 3 Marketplaces created`);
    console.log(`- 3 Marketplace configs created`);
    console.log(`- 3 Roles created`);
    console.log(`- 3 Subscription plans created`);
    console.log(`- 1 Demo user created (email: demo@sellerai.com, password: demo123)`);
    console.log(`- 8 Categories created`);
    console.log(`- 1 Demo product created`);
    console.log(`\n🔥 Trigger test: Check user_credits table for automatic balance update!`);

    // Trigger test sonucu göster
    const credits = await db.query.userCredits.findFirst({
      where: eq(schema.userCredits.userId, demoUser.id),
    });
    console.log(`\n💰 User credits after trigger:`, credits);

  } catch (error) {
    console.error("❌ Seed failed:");
    console.error(error);
    throw error;
  }

  process.exit(0);
}

seed();
