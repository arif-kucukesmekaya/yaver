# 🚀 YAVER (SellerAI) - Backend Mimarisi
## E-Ticaret İçin Yapay Zeka Destekli İçerik Üretim Platformu

---

## 📌 PROJE ÖZETİ

**YAVER**, e-ticaret satıcılarının ürün listelemelerini yapay zeka ile otomatik oluşturmasını sağlayan bir SaaS platformudur.

### Problem
- Satıcılar her pazaryeri için ayrı ayrı başlık/açıklama yazıyor
- Her platformun farklı kuralları var (karakter limiti, dil, SEO gereksinimleri)
- Profesyonel ürün görseli oluşturmak zaman alıcı ve maliyetli

### Çözüm
- **Tek girişle** 3 farklı pazaryeri için optimize içerik üretimi
- **AI ile** SEO uyumlu başlık ve açıklama oluşturma
- **AI ile** 3 farklı tarzda profesyonel ürün görseli üretimi

---

## 🛠️ TEKNOLOJİ STACK'İ

### Backend Teknolojileri

| Katman | Teknoloji | Versiyon | Seçim Gerekçesi |
|--------|-----------|----------|-----------------|
| **Runtime** | Bun | 1.3+ | Node.js'den 3x hızlı, native TypeScript desteği, tek binary |
| **Framework** | Hono.js | 4.x | Ultra hafif (12KB), Edge-ready, Express benzeri DX |
| **ORM** | Drizzle | Latest | Type-safe, SQL-like syntax, zero runtime overhead |
| **Database** | PostgreSQL | 15+ | ACID uyumlu, JSONB, ilişkisel veri modeli |
| **Validation** | Zod | 3.x | Runtime tip doğrulama, TypeScript entegrasyonu |
| **Auth** | JWT | - | Stateless, ölçeklenebilir, refresh token desteği |

### AI Servisleri

| Servis | Model | Kullanım Alanı |
|--------|-------|----------------|
| **OpenAI** | GPT-4o-mini | Metin üretimi (başlık, açıklama, SEO) |
| **Fal.ai** | Nano Banana Pro | Görsel üretimi (image-to-image, text-to-image) |

### Neden Bu Teknolojiler?

```
┌─────────────────────────────────────────────────────────────────┐
│  Bun Runtime                                                    │
│  ├── Native TypeScript (transpile gereksiz)                    │
│  ├── Built-in test runner, bundler, package manager            │
│  └── 3x faster than Node.js                                    │
├─────────────────────────────────────────────────────────────────┤
│  Hono Framework                                                 │
│  ├── 12KB bundle size (Express: 200KB+)                        │
│  ├── Middleware-first architecture                              │
│  └── Built-in validation, CORS, rate-limit                     │
├─────────────────────────────────────────────────────────────────┤
│  Drizzle ORM                                                    │
│  ├── SQL-like (new ORMs are SQL-first)                         │
│  ├── Zero runtime overhead                                      │
│  └── Type-safe queries (IntelliSense)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 PROJE MİMARİSİ

### Feature-First Modüler Yapı

```
sellerai/
├── src/
│   ├── index.ts                 # Entry point - Server başlatma
│   ├── app.ts                   # Hono app - Route mounting
│   │
│   ├── core/                    # 🏗️ ÇEKIRDEK ALTYAPI
│   │   ├── database/
│   │   │   ├── schema.ts        # 17 tablo tanımı (Drizzle)
│   │   │   ├── original.ts      # DB connection pool
│   │   │   ├── migrate.ts       # Migration runner
│   │   │   └── seeds/           # Başlangıç verileri
│   │   │
│   │   └── middleware/
│   │       ├── auth.ts          # JWT doğrulama
│   │       ├── error.ts         # Global error handler
│   │       ├── rateLimit.ts     # Rate limiting
│   │       └── upload.ts        # Multer file upload
│   │
│   ├── modules/                 # 📦 İŞ MANTIĞI MODÜLLERİ
│   │   ├── auth/                # Kimlik doğrulama
│   │   │   ├── auth.service.ts  # Business logic
│   │   │   ├── auth.routes.ts   # Route definitions
│   │   │   └── auth.schema.ts   # Zod validation schemas
│   │   │
│   │   ├── products/            # Ürün CRUD + AI trigger
│   │   ├── ai/                  # AI content generation
│   │   ├── credits/             # Kredi sistemi
│   │   ├── subscriptions/       # Abonelik yönetimi
│   │   ├── marketplace/         # Pazaryeri bilgileri
│   │   ├── categories/          # Kategori yönetimi
│   │   ├── queue/               # Async job processing
│   │   ├── upload/              # File upload handling
│   │   ├── admin/               # Admin panel APIs
│   │   ├── errors/              # Error logging
│   │   └── sse/                 # Real-time events
│   │
│   └── shared/                  # 🔧 PAYLAŞILAN YARDIMCILAR
│       ├── constants/
│       │   └── env.ts           # Environment validation
│       ├── types/
│       │   └── common.ts        # Shared TypeScript types
│       └── utils/
│           ├── jwt.ts           # Token generation/verification
│           ├── password.ts      # Bcrypt hashing
│           ├── errors.ts        # Custom error classes
│           ├── response.ts      # Standard response helpers
│           └── logger.ts        # Winston logging
│
├── drizzle/                     # Migration files
├── uploads/                     # User uploaded files
└── docs/                        # API documentation
```

### Mimari Prensipleri

```
┌─────────────────────────────────────────────────────────────┐
│                     DEPENDENCY FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   modules/  ────────►  core/  ────────►  shared/           │
│     │                    │                  │               │
│     │                    │                  │               │
│   (İş Mantığı)      (Altyapı)         (Yardımcılar)        │
│   - auth              - database        - utils             │
│   - products          - middleware      - types             │
│   - ai                                  - constants         │
│   - credits                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

✅ Modules can import from core and shared
✅ Modules can import from other modules (cross-module)
✅ Core and Shared are independent (no circular deps)
```

---

## 🗄️ VERİTABANI MİMARİSİ

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA (17 Tables)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│  │    users     │──1:1─│user_profiles │      │    roles     │              │
│  │──────────────│      │──────────────│      │──────────────│              │
│  │ id           │      │ user_id (PK) │      │ id           │              │
│  │ email        │      │ first_name   │      │ role_name    │              │
│  │ password_hash│      │ last_name    │      └──────────────┘              │
│  │ created_at   │      │ company_name │             │                      │
│  └──────────────┘      └──────────────┘             │                      │
│         │                                           │                      │
│         │ 1:1                              ┌────────┴────────┐             │
│         ▼                                  │   user_roles    │             │
│  ┌──────────────┐                          │─────────────────│             │
│  │ user_credits │                          │ user_id (PK,FK) │             │
│  │──────────────│                          │ role_id (PK,FK) │             │
│  │subscription_ │                          └─────────────────┘             │
│  │  credits     │                                                          │
│  │extra_credits │      ┌──────────────────────────────────────┐            │
│  │total_earned  │      │          SUBSCRIPTION MODULE         │            │
│  │total_spent   │      ├──────────────────────────────────────┤            │
│  └──────────────┘      │  subscription_plans ◄── user_subscriptions        │
│         │              │  payments, credit_transactions                    │
│         │ 1:N          └──────────────────────────────────────┘            │
│         ▼                                                                  │
│  ┌──────────────┐                                                          │
│  │   products   │─────────────────────────────────────────────┐            │
│  │──────────────│                                             │            │
│  │ id           │      ┌──────────────────┐                   │            │
│  │ user_id (FK) │──1:N─│product_source_   │                   │            │
│  │ category_id  │      │    images        │                   │            │
│  │ brand_name   │      └──────────────────┘                   │            │
│  │raw_user_prompt                                             │            │
│  │product_status│      ┌──────────────────┐                   │ 1:N        │
│  └──────────────┘──1:N─│ marketplace_     │                   │            │
│         │              │   listings       │◄──────────────────┤            │
│         │              │──────────────────│                   │            │
│         │              │ generated_title  │                   │            │
│         │              │generated_descrip │      ┌────────────┴───────┐    │
│         │              │ listing_status   │      │ ai_enhanced_images │    │
│         │              └──────────────────┘      │────────────────────│    │
│         │                      │                 │ image_url          │    │
│         │                      │                 │ image_type         │    │
│         │               ┌──────┴──────┐          │ prompt             │    │
│         │               │ marketplaces│          │ metadata (JSONB)   │    │
│         │               │─────────────│          └────────────────────┘    │
│         │               │ name        │                                    │
│         │               │ api_base_url│                                    │
│         │               │ logo_url    │                                    │
│         │               └─────────────┘                                    │
│         │                                                                  │
│         │ 1:N          ┌──────────────────┐     ┌──────────────────┐       │
│         └──────────────│image_processing_ │     │ generation_errors│       │
│                        │     queue        │     │──────────────────│       │
│                        │──────────────────│     │ error_type       │       │
│                        │ status (enum)    │     │ error_message    │       │
│                        │ retry_count      │     │ resolved         │       │
│                        └──────────────────┘     └──────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6 Modül, 17 Tablo

| Modül | Tablolar | Açıklama |
|-------|----------|----------|
| **🔐 Kimlik** | `users`, `user_profiles`, `roles`, `user_roles`, `password_reset_tokens`, `refresh_tokens` | Kullanıcı yönetimi, JWT auth |
| **💰 Finans** | `subscription_plans`, `user_subscriptions`, `payments`, `credit_transactions`, `user_credits` | Abonelik ve kredi sistemi |
| **🏪 Pazaryeri** | `marketplaces`, `marketplace_configs` | Platform kuralları (JSONB) |
| **📦 Ürün** | `products`, `product_source_images`, `product_marketplace_selections`, `categories` | Ürün ve görsel girişi |
| **🤖 AI Çıktı** | `marketplace_listings`, `ai_enhanced_images` | AI üretimi içerik |
| **⚙️ İşlem** | `image_processing_queue`, `generation_errors` | Async job ve hata takibi |

### Drizzle ORM Örneği

```typescript
// schema.ts - Tip-güvenli tablo tanımı
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// İlişki tanımları
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
}));

// Query örneği (Type-safe!)
const userData = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    profile: true,
    credits: true,
    products: {
      with: {
        listings: true,
        enhancedImages: true,
      },
    },
  },
});
```

---

## 🌐 API ENDPOİNT'LERİ

### Route Yapısı

```
                         ┌─────────────────────────────────────┐
                         │           app.ts (Hono)             │
                         │─────────────────────────────────────│
                         │  app.use('*', cors())               │
                         │  app.use('*', logger())             │
                         │  app.use('*', prettyJSON())         │
                         └─────────────────────────────────────┘
                                         │
           ┌─────────────────────────────┼─────────────────────────────┐
           │                             │                             │
           ▼                             ▼                             ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   /auth             │    │   /products         │    │   /ai               │
│───────────────────── │    │─────────────────────│    │─────────────────────│
│ Rate: 10/15min      │    │ Auth Required       │    │ Rate: 5/1min        │
│───────────────────── │    │─────────────────────│    │─────────────────────│
│ POST /register      │    │ GET    /            │    │ POST /generate      │
│ POST /login         │    │ GET    /:id         │    │ POST /generate-image│
│ POST /google        │    │ POST   /            │    └─────────────────────┘
│ POST /refresh       │    │ PATCH  /:id         │
│ GET  /me            │    │ DELETE /:id         │
│ POST /forgot-pwd    │    │ POST   /:id/generate│
│ POST /reset-pwd     │    │ GET    /:id/listings│
└─────────────────────┘    └─────────────────────┘

           ┌─────────────────────────────┼─────────────────────────────┐
           │                             │                             │
           ▼                             ▼                             ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   /credits          │    │   /subscriptions    │    │   /marketplaces     │
│─────────────────────│    │─────────────────────│    │─────────────────────│
│ GET  /              │    │ POST /upgrade       │    │ GET  /              │
│ GET  /history       │    │ GET  /plans         │    │ GET  /:id           │
│ POST /purchase      │    └─────────────────────┘    └─────────────────────┘
└─────────────────────┘

           ┌─────────────────────────────┼─────────────────────────────┐
           │                             │                             │
           ▼                             ▼                             ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   /categories       │    │   /queue            │    │   /upload           │
│─────────────────────│    │─────────────────────│    │─────────────────────│
│ GET  /              │    │ GET  /status        │    │ Rate: 10/1min       │
│ GET  /:id           │    │ GET  /items         │    │─────────────────────│
└─────────────────────┘    └─────────────────────┘    │ POST /product-image │
                                                       └─────────────────────┘
```

### Detaylı Endpoint Açıklamaları

#### 🔐 Auth Module

```typescript
// POST /auth/register
// Yeni kullanıcı kaydı
{
  input: {
    email: "user@example.com",
    password: "securePassword123",
    firstName: "Ali",
    lastName: "Yılmaz"
  },
  output: {
    success: true,
    data: {
      user: { id: 1, email: "user@example.com" },
      accessToken: "eyJhbG...",   // 15 dakika geçerli
      refreshToken: "eyJhbG..."   // 7 gün geçerli
    }
  }
}

// Otomatik yapılanlar:
// 1. Şifre bcrypt ile hash'lenir
// 2. user_profiles tablosuna profil eklenir
// 3. user_credits tablosuna 10 başlangıç kredisi verilir
// 4. credit_transactions'a "Welcome bonus" kaydedilir
// 5. user_roles tablosuna "Satıcı" rolü atanır
```

#### 📦 Products Module - AI Generation

```typescript
// POST /products/:id/generate-ai
// AI içerik üretimi tetikleme

// İş Akışı:
// ┌─────────────────────────────────────────────────────────────────┐
// │ 1. Eski üretim verileri silinir (temiz başlangıç)               │
// │    - DELETE FROM ai_enhanced_images WHERE product_id = ?        │
// │    - DELETE FROM marketplace_listings WHERE product_id = ?      │
// │    - DELETE FROM image_processing_queue WHERE product_id = ?    │
// │                                                                 │
// │ 2. Ürün statusu "processing" yapılır                            │
// │                                                                 │
// │ 3. Görsel üretim kuyruğuna iş eklenir                          │
// │    - INSERT INTO image_processing_queue (pending)               │
// │                                                                 │
// │ 4. [PARALEL] Her seçili pazaryeri için metin üretimi           │
// │    - Trendyol → GPT-4o → Türkçe + Emoji                        │
// │    - Hepsiburada → GPT-4o → Türkçe + Emoji                     │
// │    - Amazon → GPT-4o → İngilizce + SEO                         │
// │                                                                 │
// │ 5. queue.processor.ts 1 saniyede bir çalışır                   │
// │    - [PARALEL] 3 görsel tipi aynı anda üretilir                │
// │    - lifestyle, infographic, detail                            │
// │                                                                 │
// │ 6. Tüm işlemler tamamlanınca status "completed"                 │
// └─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 YAPAY ZEKA SERVİSLERİ

### AIService Sınıfı

```typescript
// src/modules/ai/ai.service.ts

export class AIService {

  /**
   * 📝 METİN ÜRETİMİ (GPT-4o-mini)
   * Her pazaryeri için özelleştirilmiş içerik üretir
   */
  static async generateListing(product: any, marketplaceName: string) {
    // Pazaryerine göre dil ve format belirlenir
    const isAmazon = marketplaceName.toLowerCase().includes('amazon');
    const language = isAmazon ? 'English' : 'Turkish';

    const prompt = this.buildPrompt(product, marketplaceName, language);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",           // Hızlı model
      response_format: { type: "json_object" },  // Garantili JSON
      temperature: 0.8,               // Yaratıcılık seviyesi
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    return JSON.parse(response.choices[0].message.content);
    // { title: "...", description: "...", keywords: [...] }
  }

  /**
   * 🖼️ GÖRSEL ÜRETİMİ (Fal.ai - Nano Banana Pro)
   * 2 mod destekler:
   * - Image-to-Image: Kaynak görsel varsa, ürünü koruyarak arka plan değiştirir
   * - Text-to-Image: Görsel yoksa, açıklamadan üretir
   */
  static async generateProductImage(product: any, type: ImageType) {
    const sourceImage = product.sourceImages?.[0]?.imageUrl;
    const useImageToImage = !!sourceImage;

    // Görsel tipine göre prompt oluştur
    const stylePrompt = this.getStylePrompt(type, useImageToImage);

    const result = await fal.subscribe(
      useImageToImage 
        ? "fal-ai/nano-banana-pro/edit"  // Image editing
        : "fal-ai/nano-banana-pro",       // Text-to-image
      {
        input: {
          prompt: stylePrompt,
          image_urls: useImageToImage ? [sourceImage] : undefined,
          output_format: "png",
          resolution: "1K"
        }
      }
    );

    return { url: result.images[0].url, type, mode: ... };
  }
}
```

### 3 Görsel Tipi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AI GÖRSEL ÜRETİM TİPLERİ                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │    LIFESTYLE      │  │   INFOGRAPHIC     │  │     DETAIL        │       │
│  │───────────────────│  │───────────────────│  │───────────────────│       │
│  │                   │  │                   │  │                   │       │
│  │   🏠 🌿 ☀️        │  │   ⬜ 📦 ✨        │  │   🔍 🧵 💎        │       │
│  │                   │  │                   │  │                   │       │
│  │ Ürün yaşam        │  │ Beyaz arka plan   │  │ Yakın çekim       │       │
│  │ alanında          │  │ Stüdyo çekim      │  │ Doku detayı       │       │
│  │                   │  │                   │  │                   │       │
│  │ "Modern interior, │  │ "Pure white       │  │ "Macro shot,      │       │
│  │  natural light,   │  │  background,      │  │  material texture,│       │
│  │  depth of field"  │  │  studio lighting" │  │  8K resolution"   │       │
│  │                   │  │                   │  │                   │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
│  Kullanım: Hero image   Kullanım: Ana ürün    Kullanım: Kalite             │
│            Sosyal medya            Thumbnail             gösterimi         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pazaryeri Özelleştirmesi

```typescript
// AMAZON KURALLARI (İngilizce)
{
  language: "English",
  title: {
    length: "150-200 characters",
    format: "[Brand] [Product Type] - [Key Features] | [Main Benefit]",
    keywords: "Front-load most important search terms"
  },
  description: {
    length: "800-1500 characters",
    format: "5-8 bullet points with benefits",
    style: "Professional, benefit-focused"
  }
}

// TRENDYOL KURALLARI (Türkçe)
{
  language: "Turkish",
  title: {
    length: "80-120 characters",
    format: "[Marka] [Ürün] [Özellikler] [Emojiler ✨💎]"
  },
  description: {
    length: "500-1000 characters",
    format: "Satır satır, emojilerle zenginleştirilmiş",
    style: "Friendly, exciting, benefit-focused"
  },
  emojis: ["✨", "🎁", "💎", "🌟", "⭐", "🔥"]
}
```

---

## ⚙️ ASYNC QUEUE SİSTEMİ

### Neden Queue?

```
Problem:
┌─────────────────────────────────────────────────────────────┐
│ Görsel üretimi 10-30 saniye sürer                           │
│ 3 görsel = 30-90 saniye bekleme                             │
│ HTTP timeout riski + Kötü kullanıcı deneyimi                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
Çözüm:
┌─────────────────────────────────────────────────────────────┐
│ Async Queue Pattern                                          │
│ - Kullanıcı hemen response alır                             │
│ - Görseller arka planda üretilir                            │
│ - Frontend polling ile durumu kontrol eder                  │
└─────────────────────────────────────────────────────────────┘
```

### Queue Processor Kodu

```typescript
// src/modules/queue/queue.processor.ts

export class QueueProcessor {
  private isProcessing = false;

  constructor() {
    // 1 saniyede bir kontrol et
    setInterval(() => this.process(), 1000);
  }

  async process() {
    if (this.isProcessing) return;  // Aynı anda tek iş
    this.isProcessing = true;

    try {
      // 1. En eski "pending" işi al
      const job = await db.query.imageProcessingQueue.findFirst({
        where: eq(status, 'pending'),
        orderBy: asc(createdAt),
        with: { product: { with: { sourceImages: true } } }
      });

      if (!job) return;

      // 2. Status: processing
      await updateStatus(job.id, 'processing');

      // 3. [PARALEL] 3 görsel tipini aynı anda üret
      const results = await Promise.all([
        AIService.generateProductImage(job.product, 'lifestyle'),
        AIService.generateProductImage(job.product, 'infographic'),
        AIService.generateProductImage(job.product, 'detail')
      ]);

      // 4. Sonuçları kaydet
      for (const result of results) {
        await db.insert(aiEnhancedImages).values({
          productId: job.productId,
          imageUrl: result.url,
          imageType: result.type,
          prompt: result.prompt,
          status: 'completed'
        });
      }

      // 5. Ürün statusu: completed
      await updateProductStatus(job.productId, 'completed');

    } catch (error) {
      // Hata logla ve status: failed
      await logError(error);
    } finally {
      this.isProcessing = false;
    }
  }
}
```

### Queue Flow Diyagramı

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           QUEUE PROCESSING FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User clicks "Generate AI"                                                  │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │ POST /generate  │────►│ INSERT queue    │────►│ Return 200 OK   │       │
│  │                 │     │ status: pending │     │ {msg: "Started"}│       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│                                   │                                         │
│                                   │ (Async - Background)                    │
│                                   ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                    QUEUE PROCESSOR (Every 1s)                    │       │
│  ├─────────────────────────────────────────────────────────────────┤       │
│  │                                                                  │       │
│  │   ┌────────────┐    ┌────────────┐    ┌────────────┐            │       │
│  │   │  pending   │───►│ processing │───►│ completed  │            │       │
│  │   └────────────┘    └────────────┘    └────────────┘            │       │
│  │         │                 │                  │                   │       │
│  │         │                 │                  │                   │       │
│  │         ▼                 ▼                  ▼                   │       │
│  │    Pick oldest      Generate 3         Save to                   │       │
│  │    job from         images in          ai_enhanced_              │       │
│  │    queue            PARALLEL           images                    │       │
│  │                                                                  │       │
│  │   On Error:  ─────────────────────►  status: failed             │       │
│  │              LOG to generation_errors table                      │       │
│  │                                                                  │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 KREDİ SİSTEMİ

### İki Tip Kredi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DUAL CREDIT SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │   SUBSCRIPTION CREDITS      │    │     EXTRA CREDITS           │        │
│  │─────────────────────────────│    │─────────────────────────────│        │
│  │                             │    │                             │        │
│  │  📅 Aylık yenilenir         │    │  💰 Satın alınır            │        │
│  │  ⏰ Ay sonunda sıfırlanır   │    │  📈 Birikimli (silinmez)    │        │
│  │  🎁 Planla birlikte gelir   │    │  🛒 Kullandıkça azalır      │        │
│  │                             │    │                             │        │
│  │  Starter: 10 kredi/ay       │    │  Paket: 50 kredi = 49₺      │        │
│  │  Pro: 100 kredi/ay          │    │  Paket: 100 kredi = 89₺     │        │
│  │  Enterprise: 500 kredi/ay   │    │  Paket: 250 kredi = 199₺    │        │
│  │                             │    │                             │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
│                                                                             │
│                          HARCAMA ÖNCELİĞİ                                  │
│                          ─────────────────                                 │
│                                                                             │
│           ┌──────────────┐         ┌──────────────┐                        │
│           │ Subscription │  ───►   │    Extra     │                        │
│           │   Credits    │  önce   │   Credits    │                        │
│           └──────────────┘         └──────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CreditService Implementasyonu

```typescript
// src/modules/credits/credit.service.ts

export class CreditService {
  
  /**
   * Kredi düşme mantığı:
   * 1. Önce subscription kredisinden düş
   * 2. Yetmezse extra krediden düş
   */
  static async deductCredits(userId: number, amount: number, description: string) {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId)
    });

    const totalAvailable = userCredit.subscriptionCredits + userCredit.extraCredits;
    
    if (totalAvailable < amount) {
      throw new InsufficientCreditsError(`Need ${amount}, have ${totalAvailable}`);
    }

    // Dağılımı hesapla
    let subDeduct = 0, extraDeduct = 0;
    
    if (userCredit.subscriptionCredits >= amount) {
      subDeduct = amount;
    } else {
      subDeduct = userCredit.subscriptionCredits;
      extraDeduct = amount - subDeduct;
    }

    // Atomic update
    await db.update(userCredits).set({
      subscriptionCredits: userCredit.subscriptionCredits - subDeduct,
      extraCredits: userCredit.extraCredits - extraDeduct,
      totalSpent: userCredit.totalSpent + amount
    }).where(eq(userCredits.userId, userId));

    // Transaction log
    await db.insert(creditTransactions).values({
      userId,
      amount: -amount,
      transactionType: 'usage',
      description
    });
  }
}
```

---

## 🔒 GÜVENLİK MİMARİSİ

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JWT AUTHENTICATION FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────┐         ┌────────────┐         ┌────────────┐              │
│  │   LOGIN    │         │  ACCESS    │         │  REFRESH   │              │
│  ├────────────┤         ├────────────┤         ├────────────┤              │
│  │            │         │            │         │            │              │
│  │ email      │────────►│ JWT Token  │         │ JWT Token  │              │
│  │ password   │         │ exp: 15min │         │ exp: 7days │              │
│  │            │         │            │         │            │              │
│  │ ✓ Hash     │         │ Payload:   │         │ Payload:   │              │
│  │   verify   │         │ - userId   │         │ - userId   │              │
│  │            │         │ - email    │         │            │              │
│  └────────────┘         └────────────┘         └────────────┘              │
│                                                                             │
│                         TOKEN REFRESH FLOW                                  │
│                         ──────────────────                                 │
│                                                                             │
│  Access Token Expired?                                                      │
│          │                                                                  │
│          ▼                                                                  │
│  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐   │
│  │ POST /auth/refresh│───►│ Verify Refresh    │───►│ Issue New Access  │   │
│  │ { refreshToken }  │    │ Token in DB       │    │ Token (15min)     │   │
│  └───────────────────┘    └───────────────────┘    └───────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│                           Check: Not expired                                │
│                           Check: Not revoked                                │
│                           Check: User exists                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Middleware Zinciri

```typescript
// Request işleme sırası

Request
    │
    ▼
┌─────────────────┐
│  CORS           │  Cross-Origin izinleri
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Logger         │  HTTP request loglama (Winston)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rate Limiter   │  Endpoint bazlı limit
│─────────────────│
│  /auth: 10/15m  │  (Brute force koruması)
│  /ai: 5/1m      │  (API maliyet kontrolü)
│  /upload: 10/1m │  (DoS koruması)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│  JWT doğrulama
│─────────────────│
│  1. Header check│  "Authorization: Bearer ..."
│  2. JWT verify  │  Signature + Expiry
│  3. User lookup │  DB'de kullanıcı var mı?
│  4. Set context │  c.set('user', {...})
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zod Validator  │  Request body doğrulama
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Handler  │  Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Error Handler  │  Global catch + format
└─────────────────┘
```

### Şifre Güvenliği

```typescript
// src/shared/utils/password.ts

// Bun'ın native bcrypt implementasyonu
export const hashPassword = (password: string): Promise<string> => {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10  // 2^10 iterations
  });
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return Bun.password.verify(password, hash);
};

// Salt otomatik eklenir, her hash benzersizdir
// Aynı şifre → Farklı hash
```

---

## 📊 RESPONSE FORMATLARI

### Standart Response

```typescript
// Başarılı
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-12-17T10:00:00.000Z"
}

// Hata
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-12-17T10:00:00.000Z"
}
```

### Pagination

```typescript
// GET /products?page=2&limit=10
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "totalPublished": 30,  // Aktif listeler
    "totalDraft": 15,      // Taslaklar
    "hasNext": true,
    "hasPrev": true
  },
  "timestamp": "2025-12-17T10:00:00.000Z"
}
```

### Custom Error Classes

```typescript
// src/shared/utils/errors.ts

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);  // Bad Request
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);  // Unauthorized
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 404);  // Not Found
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(message: string = 'Insufficient credits') {
    super(message, 402);  // Payment Required
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);  // Conflict
  }
}
```

---

## 🚀 DEPLOYMENT & ÇALIŞTIRMA

### Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/sellerai"
JWT_SECRET="super-secret-key-256-bit"
JWT_REFRESH_SECRET="another-secret-for-refresh"
OPENAI_API_KEY="sk-..."
FAL_KEY="fal-..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
PORT=8881
NODE_ENV="development"
```

### Komutlar

```bash
# Development (Hot reload)
bun run dev

# Production
bun run start

# Database operations
bun db:push      # Schema sync
bun db:migrate   # Run migrations
bun db:seed      # Insert seed data
bun db:studio    # Drizzle Studio GUI

# Testing
bun test
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sellerai
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📈 PERFORMANS OPTİMİZASYONLARI

| Alan | Optimizasyon | Etki |
|------|--------------|------|
| **Runtime** | Bun | Node.js'den 3x hızlı |
| **AI Text** | GPT-4o-mini | GPT-4'ten 10x hızlı, 20x ucuz |
| **AI Image** | Paralel üretim | 3 görsel = 1 görsel süresi |
| **Database** | Connection pooling | Bağlantı yeniden kullanımı |
| **Database** | Indexler | Sık sorgulanan alanlarda |
| **Response** | JSON streaming | Büyük listeler için |

---

## 🎯 ÖZET: BACKEND'İN 6 TEMEL ÖZELLİĞİ

1. **🏗️ Modüler Mimari** - Feature-first, izole, test edilebilir
2. **🤖 Çift AI Entegrasyonu** - GPT-4o (metin) + Fal.ai (görsel)
3. **⚙️ Async Queue** - Ağır işlemler arka planda, polling ile takip
4. **💰 Çift Kredi Sistemi** - Subscription + Extra, kullanım tabanlı
5. **🔒 JWT Auth** - Stateless, refresh token, rate limiting
6. **📊 Type-Safe ORM** - Drizzle ile compile-time query doğrulama

---

## 📌 SUNUM İÇİN ÖNERİLEN DEMO AKIŞI

```
1. Health Check göster (localhost:8881)
2. Swagger UI göster (localhost:8881/api-docs)
3. Postman/Curl ile register + login
4. Yeni ürün oluştur (görsel yükle)
5. "Oluştur" butonuna bas
6. Queue status göster (processing)
7. 30 saniye bekle
8. AI üretimi sonuçlarını göster:
   - 3 pazaryeri için başlık/açıklama
   - 3 farklı tarz görsel
9. Kredi düşüşünü göster (10 → 9)
10. Database tablolarını göster (Drizzle Studio)
```

---

**📅 Oluşturulma:** 17 Aralık 2025  
**🏗️ Mimari:** Modüler, RESTful API, Feature-First  
**🔧 Teknoloji:** Bun + Hono + Drizzle + PostgreSQL + OpenAI + Fal.ai
