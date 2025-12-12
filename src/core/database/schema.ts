import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum, jsonb, primaryKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== ENUMS ====================
export const productStatusEnum = pgEnum("product_status", ["draft", "processing", "completed", "failed"]);
export const listingStatusEnum = pgEnum("listing_status", ["draft", "published", "error"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["purchase", "monthly_refill", "usage", "bonus"]);
export const queueStatusEnum = pgEnum("queue_status", ["pending", "processing", "completed", "failed"]);

// ==================== MODÜL 1: Kimlik ve Yetkilendirme ====================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  userId: integer("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  companyName: varchar("company_name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  roleName: varchar("role_name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx: index("password_reset_user_idx").on(table.userId),
  tokenIdx: index("password_reset_token_idx").on(table.token),
}));

// Refresh tokens table
export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 500 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revoked: boolean("revoked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx: index("refresh_token_user_idx").on(table.userId),
  tokenIdx: index("refresh_token_idx").on(table.token),
}));

// ==================== MODÜL 2: Finans ve Abonelik ====================

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  monthlyCreditLimit: integer("monthly_credit_limit").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // pozitif: eklenme, negatif: harcama
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  description: text("description"),
  relatedProductId: integer("related_product_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userCreatedIdx: index("credit_trans_user_created_idx").on(table.userId, table.createdAt),
}));

export const userCredits = pgTable("user_credits", {
  userId: integer("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  availableCredits: integer("available_credits").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  lastRefillDate: timestamp("last_refill_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== MODÜL 3: Pazaryeri Entegrasyonu ====================

export const marketplaces = pgTable("marketplaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  apiBaseUrl: varchar("api_base_url", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const marketplaceConfigs = pgTable("marketplace_configs", {
  id: serial("id").primaryKey(),
  marketplaceId: integer("marketplace_id").notNull().references(() => marketplaces.id, { onDelete: "cascade" }),
  config: jsonb("config").notNull(), // max_title_length, description_max_length, language, banned_words, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== MODÜL 4: Ürün ve Girdi ====================

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  parentRef: index("category_parent_idx").on(table.parentId),
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id),
  brandName: varchar("brand_name", { length: 255 }),
  rawUserPrompt: text("raw_user_prompt"),
  productStatus: productStatusEnum("product_status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userCreatedIdx: index("products_user_created_idx").on(table.userId, table.createdAt),
}));

export const productSourceImages = pgTable("product_source_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productMarketplaceSelections = pgTable("product_marketplace_selections", {
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  marketplaceId: integer("marketplace_id").notNull().references(() => marketplaces.id, { onDelete: "cascade" }),
  isSelected: boolean("is_selected").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.marketplaceId] }),
}));

// ==================== MODÜL 5: AI Çıktıları ve Listeleme ====================

export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  marketplaceId: integer("marketplace_id").notNull().references(() => marketplaces.id, { onDelete: "cascade" }),
  generatedTitle: varchar("generated_title", { length: 500 }),
  generatedDescription: text("generated_description"),
  listingStatus: listingStatusEnum("listing_status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  productMarketplaceIdx: index("listings_product_marketplace_idx").on(table.productId, table.marketplaceId),
}));

export const aiEnhancedImages = pgTable("ai_enhanced_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== MODÜL 6: İşleme Kuyruğu ve Hata Yönetimi ====================

export const imageProcessingQueue = pgTable("image_processing_queue", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sourceImageUrl: varchar("source_image_url", { length: 512 }).notNull(),
  status: queueStatusEnum("status").notNull().default("pending"),
  geminiJobId: varchar("gemini_job_id", { length: 255 }),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const generationErrors = pgTable("generation_errors", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  marketplaceId: integer("marketplace_id").references(() => marketplaces.id),
  errorType: varchar("error_type", { length: 100 }).notNull(),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").notNull().default(0),
  resolved: boolean("resolved").notNull().default(false),
  lastRetryAt: timestamp("last_retry_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  productMarketplaceIdx: index("errors_product_marketplace_idx").on(table.productId, table.marketplaceId),
}));

// ==================== İLİŞKİLER (Relations) ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  credits: one(userCredits, {
    fields: [users.id],
    references: [userCredits.userId],
  }),
  products: many(products),
  subscriptions: many(userSubscriptions),
  payments: many(payments),
  creditTransactions: many(creditTransactions),
  userRoles: many(userRoles),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  sourceImages: many(productSourceImages),
  enhancedImages: many(aiEnhancedImages),
  listings: many(marketplaceListings),
  marketplaceSelections: many(productMarketplaceSelections),
  processingQueue: many(imageProcessingQueue),
  errors: many(generationErrors),
}));

export const productSourceImagesRelations = relations(productSourceImages, ({ one }) => ({
  product: one(products, {
    fields: [productSourceImages.productId],
    references: [products.id],
  }),
}));

export const aiEnhancedImagesRelations = relations(aiEnhancedImages, ({ one }) => ({
  product: one(products, {
    fields: [aiEnhancedImages.productId],
    references: [products.id],
  }),
}));

export const marketplaceListingsRelations = relations(marketplaceListings, ({ one }) => ({
  product: one(products, {
    fields: [marketplaceListings.productId],
    references: [products.id],
  }),
  marketplace: one(marketplaces, {
    fields: [marketplaceListings.marketplaceId],
    references: [marketplaces.id],
  }),
}));

export const productMarketplaceSelectionsRelations = relations(productMarketplaceSelections, ({ one }) => ({
  product: one(products, {
    fields: [productMarketplaceSelections.productId],
    references: [products.id],
  }),
  marketplace: one(marketplaces, {
    fields: [productMarketplaceSelections.marketplaceId],
    references: [marketplaces.id],
  }),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const marketplacesRelations = relations(marketplaces, ({ many }) => ({
  configs: many(marketplaceConfigs),
  listings: many(marketplaceListings),
  selections: many(productMarketplaceSelections),
}));

export const marketplaceConfigsRelations = relations(marketplaceConfigs, ({ one }) => ({
  marketplace: one(marketplaces, {
    fields: [marketplaceConfigs.marketplaceId],
    references: [marketplaces.id],
  }),
}));
