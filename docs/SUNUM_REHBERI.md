# 🎤 BACKEND SUNUM REHBERİ - TAM VERSİYON

---

## ⏱️ ZAMAN PLANI

| Dakika | Konu | Ne Yapacaksın |
|--------|------|---------------|
| 0:00 - 1:00 | Giriş + Teknoloji Stack | Bun, Hono, Drizzle tanıt |
| 1:00 - 3:00 | Klasör Yapısı | core/, modules/, shared/ göster |
| 3:00 - 5:00 | Modül Anatomisi | route → controller → service akışı |
| 5:00 - 7:00 | SQL Örneği | admin.service.ts Promise.all göster |
| 7:00 - 9:00 | Swagger Demo | Login → Token → Dashboard çağır |
| 9:00 - 10:00 | Kapanış | Senaryo + Genel iş akışı özeti |

---

# 📍 BÖLÜM 1: GİRİŞ + TEKNOLOJİ STACK (1 dakika)

## Söylenecekler:

> "Backend tarafında modern teknolojiler kullandık. Size kısaca tanıtayım:"

## Teknoloji Stack Tablosu:

| Teknoloji | Ne İşe Yarıyor | Neden Seçtik |
|-----------|----------------|--------------|
| **Bun** | JavaScript/TypeScript runtime | Node.js'den 3x hızlı, native TypeScript |
| **Hono.js** | Web framework (Express alternatifi) | 12KB, ultra hafif, hızlı |
| **Drizzle ORM** | Veritabanı işlemleri | Type-safe SQL, IDE desteği |
| **PostgreSQL** | Veritabanı | İlişkisel, JSONB desteği |
| **Zod** | Validation (doğrulama) | Runtime tip kontrolü |
| **JWT** | Authentication (kimlik doğrulama) | Stateless, güvenli |

## Gösterilecek Dosya:
**`src/index.ts`** - Sunucu başlatma noktası

```typescript
import { serve } from '@hono/node-server';
import app from './app';

serve({ fetch: app.fetch, port: 8881 });
// 🚀 SellerAI API started on port 8881
```

---

# 📍 BÖLÜM 2: KLASÖR YAPISI (2 dakika)

## Söylenecekler:

> "Backend'i 3 ana katmana ayırdık. Bu **separation of concerns** prensibi - her katmanın görevi farklı."

## Klasör Yapısı:

```
src/
│
├── core/                    ← 🏗️ ALTYAPI
│   ├── database/
│   │   ├── schema.ts        ← Tablo tanımları (17 tablo)
│   │   └── original.ts      ← DB bağlantısı
│   └── middleware/
│       ├── auth.ts          ← JWT doğrulama
│       ├── rateLimit.ts     ← İstek limitleme
│       └── error.ts         ← Hata yakalama
│
├── modules/                 ← 📦 İŞ MANTIĞI
│   ├── auth/                ← Kimlik doğrulama
│   ├── products/            ← Ürün CRUD + AI
│   ├── ai/                  ← Yapay zeka servisleri
│   ├── credits/             ← Kredi sistemi
│   ├── admin/               ← Admin paneli
│   ├── queue/               ← Arka plan işleri
│   └── ...
│
├── shared/                  ← 🔧 PAYLAŞILAN
│   ├── utils/
│   │   ├── jwt.ts           ← Token üretimi
│   │   ├── password.ts      ← Şifre hashleme
│   │   └── errors.ts        ← Hata sınıfları
│   └── constants/
│       └── env.ts           ← Ortam değişkenleri
│
├── app.ts                   ← Ana uygulama
└── index.ts                 ← Giriş noktası
```

## Her Katmanın Görevi:

| Katman | Görev | Örnek |
|--------|-------|-------|
| **core/** | Altyapı, tüm modüllerin kullandığı | Database bağlantısı, JWT middleware |
| **modules/** | İş mantığı, her özellik ayrı | auth, products, ai, credits |
| **shared/** | Yardımcı fonksiyonlar | Token üretimi, şifre hashleme |

## Bağımlılık Akışı:

```
modules/  →  core/  →  shared/
   ↓           ↓          ↓
İş mantığı   Altyapı   Yardımcılar
```

> "Modüller core'u kullanır, core shared'ı kullanır. Ters yönde bağımlılık yok."

---

# 📍 BÖLÜM 3: MODÜL ANATOMİSİ (2 dakika)

## Söylenecekler:

> "Her modülün yapısı aynı. Bu tutarlılık sayesinde yeni özellik eklemek kolay."

## Bir Modülün İçi:

```
modules/auth/
├── auth.routes.ts      ← URL tanımları (POST /auth/login)
├── auth.controller.ts  ← Request/Response işleme
├── auth.service.ts     ← İş mantığı + DB sorguları
├── auth.schema.ts      ← Zod validation şemaları
└── index.ts            ← Export'lar
```

## Request Akışı (ÇOK ÖNEMLİ!):

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST AKIŞI                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   HTTP İsteği (POST /auth/login)                               │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │   app.ts    │  Route mounting                               │
│   │             │  app.route('/auth', authRoutes)              │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │ Middleware  │  1. Logger (log yaz)                         │
│   │   Zinciri   │  2. CORS (cross-origin izin)                 │
│   │             │  3. Rate Limit (istek sınırla)               │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │ routes.ts   │  URL eşlemesi                                │
│   │             │  POST /login → zValidator → Controller       │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │ Zod Valid.  │  Body doğrulama                              │
│   │             │  { email: string, password: string }         │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌──────────────┐                                             │
│   │ controller   │  Request al, Service'e gönder               │
│   │              │  const result = await AuthService.login()   │
│   └──────────────┘                                             │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │ service.ts  │  İş mantığı + SQL sorguları                  │
│   │             │  const user = await db.query.users.find()    │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                              │
│   │  Database   │  PostgreSQL                                  │
│   │             │  SELECT * FROM users WHERE email = ?         │
│   └─────────────┘                                              │
│        │                                                        │
│        ▼                                                        │
│   JSON Response                                                 │
│   { success: true, data: { accessToken, user } }               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Kod Örnekleri:

### routes.ts (URL Tanımı)
```typescript
// src/modules/auth/auth.routes.ts
authRoutes.post('/login', 
  zValidator('json', loginSchema),  // ← Zod ile doğrulama
  AuthController.login              // ← Controller'a yönlendir
);
```

### controller.ts (Request İşleme)
```typescript
// src/modules/auth/auth.controller.ts
static async login(c: Context) {
  const { email, password } = c.req.valid('json');
  const result = await AuthService.login({ email, password });
  return c.json({ success: true, data: result });
}
```

### service.ts (İş Mantığı + DB)
```typescript
// src/modules/auth/auth.service.ts
static async login(input: LoginInput) {
  // 1. Kullanıcıyı bul
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });
  
  // 2. Şifreyi kontrol et
  const isValid = await comparePassword(input.password, user.passwordHash);
  
  // 3. Token üret
  const accessToken = generateToken({ userId: user.id });
  
  return { user, accessToken };
}
```

---

# 📍 BÖLÜM 4: ENDPOINT OLUŞTURMA (Detaylı)

## Yeni Endpoint Nasıl Eklenir?

### Adım 1: Route Tanımla
**Dosya:** `modules/xxx/xxx.routes.ts`

```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../../core/middleware/auth';

const myRoutes = new Hono();

// Tüm route'lara auth ekle
myRoutes.use('*', authMiddleware);

// GET endpoint
myRoutes.get('/', async (c) => {
  // Liste getir
});

// POST endpoint
myRoutes.post('/', zValidator('json', createSchema), async (c) => {
  // Yeni kayıt oluştur
});

// PATCH endpoint
myRoutes.patch('/:id', zValidator('json', updateSchema), async (c) => {
  // Güncelle
});

// DELETE endpoint
myRoutes.delete('/:id', async (c) => {
  // Sil
});

export { myRoutes };
```

### Adım 2: Service Yaz
**Dosya:** `modules/xxx/xxx.service.ts`

```typescript
export class MyService {
  static async getAll(userId: number) {
    return db.query.myTable.findMany({
      where: eq(myTable.userId, userId),
    });
  }
  
  static async create(data: CreateInput) {
    const [result] = await db.insert(myTable).values(data).returning();
    return result;
  }
}
```

### Adım 3: App'e Bağla
**Dosya:** `app.ts`

```typescript
import { myRoutes } from './modules/xxx';

// Route'u mount et
app.route('/my-endpoint', myRoutes);
```

### Sonuç:
```
GET    /my-endpoint        → Liste
POST   /my-endpoint        → Oluştur
PATCH  /my-endpoint/:id    → Güncelle
DELETE /my-endpoint/:id    → Sil
```

---

# 📍 BÖLÜM 5: SQL SORGULARI - DRİZZLE ORM

## Drizzle vs Raw SQL Karşılaştırması:

| İşlem | Drizzle ORM | Üretilen SQL |
|-------|-------------|--------------|
| **Tümünü Getir** | `db.select().from(users)` | `SELECT * FROM users` |
| **Filtreleme** | `db.select().from(users).where(eq(users.id, 5))` | `SELECT * FROM users WHERE id = 5` |
| **Sayma** | `db.select({ count: count() }).from(users)` | `SELECT COUNT(*) FROM users` |
| **Ekleme** | `db.insert(users).values({ email: 'x@y.com' })` | `INSERT INTO users (email) VALUES ('x@y.com')` |
| **Güncelleme** | `db.update(users).set({ name: 'Ali' }).where(eq(users.id, 1))` | `UPDATE users SET name = 'Ali' WHERE id = 1` |
| **Silme** | `db.delete(users).where(eq(users.id, 1))` | `DELETE FROM users WHERE id = 1` |

## Gerçek Örnek: admin.service.ts (Dashboard İstatistikleri)

```typescript
// 6 farklı sorguyu PARALEL çalıştırıyoruz
const [
    [usersCount],        // Toplam kullanıcı
    [productsCount],     // Toplam ürün
    [listingsCount],     // Toplam listeleme
    [creditsResult],     // Kullanılan kredi
    [newUsersCount],     // Bugün yeni kullanıcı
    [newProductsCount],  // Bugün yeni ürün
] = await Promise.all([

    // 1. SELECT COUNT(*) FROM users
    db.select({ count: count() }).from(users),
    
    // 2. SELECT COUNT(*) FROM products
    db.select({ count: count() }).from(products),
    
    // 3. SELECT COUNT(*) FROM marketplace_listings
    db.select({ count: count() }).from(marketplaceListings),
    
    // 4. SELECT COALESCE(SUM(ABS(amount)), 0) FROM credit_transactions
    //    WHERE transaction_type = 'usage'
    db.select({ 
        total: sql<number>`COALESCE(SUM(ABS(amount)), 0)` 
    })
    .from(creditTransactions)
    .where(eq(creditTransactions.transactionType, 'usage')),
    
    // 5. SELECT COUNT(*) FROM users WHERE created_at >= today
    db.select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, today)),
    
    // 6. SELECT COUNT(*) FROM products WHERE created_at >= today
    db.select({ count: count() })
      .from(products)
      .where(gte(products.createdAt, today)),
]);

// Sonuç objesi
return {
    totalUsers: usersCount?.count || 0,
    totalProducts: productsCount?.count || 0,
    totalListings: listingsCount?.count || 0,
    totalCreditsUsed: Number(creditsResult?.total) || 0,
    newUsersToday: newUsersCount?.count || 0,
    newProductsToday: newProductsCount?.count || 0,
};
```

### Neden Promise.all?
> "6 sorguyu sırayla çalıştırsak 6x sürer. Promise.all ile **paralel** çalıştırıyoruz.
> Tüm sorgular aynı anda gidiyor, en yavaş olanın süresinde tamamlanıyor."

### Raw SQL Örneği (Karmaşık sorgular için):
```typescript
// CASE WHEN ile conditional aggregation
const stats = await db
    .select({
        total: count(),
        unresolved: sql`SUM(CASE WHEN ${errors.resolved} = false THEN 1 ELSE 0 END)`,
    })
    .from(errors);

// Üretilen SQL:
// SELECT COUNT(*), SUM(CASE WHEN resolved = false THEN 1 ELSE 0 END)
// FROM generation_errors
```

---

# 📍 BÖLÜM 6: SWAGGER UI DEMO (2 dakika)

## Adım Adım Demo:

### 1️⃣ Swagger UI'ı Aç
```
http://localhost:8881/api-docs
```

### 2️⃣ Login Ol (Token Al)
1. **Auth** bölümünü bul
2. `POST /auth/login` → **Try it out**
3. Body:
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```
4. **Execute** → Response'dan `accessToken` kopyala

### 3️⃣ Token'ı Sisteme Ekle
1. Sağ üstte **🔓 Authorize** butonuna tıkla
2. Value alanına yaz: `Bearer <token>`
3. **Authorize** → **Close**

### 4️⃣ Dashboard Endpoint'i Çağır
1. **Admin** bölümüne git
2. `GET /admin/dashboard` → **Try it out** → **Execute**

### 5️⃣ Sonucu Göster ve Açıkla
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 18,
      "totalProducts": 20,
      "totalListings": 30,
      "totalCreditsUsed": 23,
      "newUsersToday": 1,
      "newProductsToday": 4
    }
  }
}
```

> "Az önce kodunu gösterdiğim 6 SQL sorgusunun sonucu bu. 
> Promise.all ile paralel çalıştırıldı ve JSON olarak döndü."

---

# 📍 BÖLÜM 7: TAM SENARYO - KULLANICI RESİM YÜKLÜYOR

## 🎬 Senaryo: Kullanıcı ürün oluşturuyor ve AI içerik üretiyor

### Başlangıç Durumu:
- Kullanıcı frontend'de login olmuş
- "Yeni Ürün" sayfasına gelmiş
- Ürün resmi yüklemiş ve açıklama girmiş:
  - 📷 Resim: `kahve_makinesi.jpg`
  - 📝 Açıklama: "Philips marka otomatik espresso makinesi, 15 bar basınç"
  - ✅ Trendyol, Hepsiburada, Amazon seçili

---

## ▶️ ADIM 1: Frontend Form Submit

```
Kullanıcı "Ürün Oluştur" butonuna basar
         │
         ▼
Frontend (React) şu işlemleri yapar:
1. Resmi base64'e çevirir
2. Form verilerini JSON'a paketler
3. HTTP POST isteği gönderir
```

**Frontend'den giden istek:**
```javascript
fetch('http://localhost:8881/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbG...'  // ← JWT Token
  },
  body: JSON.stringify({
    brandName: 'Philips',
    rawUserPrompt: 'Otomatik espresso makinesi, 15 bar basınç',
    categoryId: 1,
    marketplaceIds: [1, 2, 3],  // Trendyol, Hepsiburada, Amazon
    imageBase64: 'data:image/jpeg;base64,/9j/4AAQ...'
  })
})
```

---

## ▶️ ADIM 2: Backend Request Alıyor

```
HTTP POST /products
         │
         ▼
┌─────────────────────────────────────────────────────┐
│                    MIDDLEWARE ZİNCİRİ               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. CORS Middleware                                 │
│     → Cross-origin izin kontrolü                   │
│     → ✅ İzin verildi                              │
│                                                     │
│  2. Logger Middleware                               │
│     → Request loglandı                             │
│     → [POST /products] - 13:45:00                  │
│                                                     │
│  3. Auth Middleware ⚠️ ÖNEMLİ                       │
│     → Authorization header kontrol                 │
│     → JWT token verify                             │
│     → Token geçerli mi? ✅                         │
│     → User bilgisi context'e eklendi               │
│     → c.set('user', { id: 13, email: '...' })     │
│                                                     │
│  4. Zod Validation                                  │
│     → brandName: string ✅                         │
│     → rawUserPrompt: string (min 10 char) ✅       │
│     → marketplaceIds: number[] ✅                  │
│     → imageBase64: string ✅                       │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         ▼
    products.routes.ts
```

---

## ▶️ ADIM 3: Route → Service

**Dosya:** `src/modules/products/products.routes.ts`

```typescript
productRoutes.post('/', zValidator('json', createProductSchema), async (c) => {
  const user = c.get('user');  // Auth middleware'den geldi
  const { brandName, rawUserPrompt, marketplaceIds, imageBase64 } = c.req.valid('json');
  
  // ... işlemler service'e aktarılır
});
```

---

## ▶️ ADIM 4: Veritabanı İşlemleri (Transaction)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE İŞLEMLERİ                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ÜRÜN OLUŞTUR                                               │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ INSERT INTO products                                 │    │
│     │   (user_id, brand_name, raw_user_prompt, status)    │    │
│     │ VALUES                                               │    │
│     │   (13, 'Philips', 'Otomatik espresso...', 'draft')  │    │
│     │ RETURNING id;                                        │    │
│     │                                                      │    │
│     │ → Yeni ürün ID: 28                                  │    │
│     └─────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  2. RESMİ KAYDET                                               │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ // Base64'ü dosyaya yaz                             │    │
│     │ fs.writeFile('uploads/product_28_1234.jpg', buffer) │    │
│     │                                                      │    │
│     │ INSERT INTO product_source_images                    │    │
│     │   (product_id, image_url)                           │    │
│     │ VALUES                                               │    │
│     │   (28, '/uploads/product_28_1234.jpg');             │    │
│     └─────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  3. PAZARYERI SEÇİMLERİNİ KAYDET                               │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ INSERT INTO product_marketplace_selections           │    │
│     │   (product_id, marketplace_id, is_selected)         │    │
│     │ VALUES                                               │    │
│     │   (28, 1, true),  -- Trendyol                       │    │
│     │   (28, 2, true),  -- Hepsiburada                    │    │
│     │   (28, 3, true);  -- Amazon                         │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ▶️ ADIM 5: Response Dönüyor

**Backend → Frontend'e dönen response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 28,
    "userId": 13,
    "brandName": "Philips",
    "rawUserPrompt": "Otomatik espresso makinesi, 15 bar basınç",
    "productStatus": "draft",
    "sourceImages": [
      { "id": 1, "imageUrl": "/uploads/product_28_1234.jpg" }
    ],
    "marketplaceSelections": [
      { "marketplaceId": 1, "marketplace": { "name": "Trendyol" } },
      { "marketplaceId": 2, "marketplace": { "name": "Hepsiburada" } },
      { "marketplaceId": 3, "marketplace": { "name": "Amazon" } }
    ]
  },
  "timestamp": "2025-12-17T13:45:00.000Z"
}
```

---

## ▶️ ADIM 6: Kullanıcı "Oluştur" Butonuna Basıyor (AI Üretim)

Kullanıcı ürün detay sayfasında "AI ile Oluştur" butonuna basar:

```
POST /products/28/generate-ai
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI GENERATION SÜRECİ                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ÜRÜN STATUSU GÜNCELLE                                      │
│     UPDATE products SET status = 'processing' WHERE id = 28    │
│                                                                 │
│  2. ESKİ VERİLERİ TEMİZLE (varsa)                              │
│     DELETE FROM ai_enhanced_images WHERE product_id = 28       │
│     DELETE FROM marketplace_listings WHERE product_id = 28     │
│                                                                 │
│  3. GÖRSEL KUYRUĞUNA EKLE                                      │
│     INSERT INTO image_processing_queue                          │
│       (product_id, source_image_url, status)                   │
│     VALUES (28, '/uploads/product_28_1234.jpg', 'pending')     │
│                                                                 │
│  4. METİN ÜRETİMİ (GPT-4o-mini) - 3 PAZARYERI                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │  PARALEL ÇALIŞIYOR (Promise.all)                    │    │
│     │                                                      │    │
│     │  → Trendyol: Türkçe + Emoji                         │    │
│     │  → Hepsiburada: Türkçe + Emoji                      │    │
│     │  → Amazon: İngilizce + SEO                          │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                 │
│     Her biri için:                                              │
│     INSERT INTO marketplace_listings                            │
│       (product_id, marketplace_id, generated_title,            │
│        generated_description, status)                           │
│     VALUES (28, 1, 'Philips Espresso ☕✨', '...', 'draft')     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ▶️ ADIM 7: Queue Processor (Arka Plan Görevi)

```
┌─────────────────────────────────────────────────────────────────┐
│              QUEUE PROCESSOR (Her 1 saniyede çalışır)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  while (true) {                                                 │
│    // 1. Bekleyen iş var mı?                                   │
│    SELECT * FROM image_processing_queue                         │
│      WHERE status = 'pending'                                   │
│      ORDER BY created_at ASC                                    │
│      LIMIT 1;                                                   │
│                                                                 │
│    // 2. Varsa işle                                            │
│    if (job) {                                                   │
│      UPDATE queue SET status = 'processing'                     │
│                                                                 │
│      // 3. Fal.ai'ya 3 görsel isteği (PARALEL)                 │
│      Promise.all([                                              │
│        generateImage('lifestyle'),   // Yaşam tarzı görsel     │
│        generateImage('infographic'), // Ürün detay görsel      │
│        generateImage('detail'),      // Yakın çekim            │
│      ])                                                         │
│                                                                 │
│      // 4. Sonuçları kaydet                                    │
│      INSERT INTO ai_enhanced_images                             │
│        (product_id, image_url, image_type, status)             │
│      VALUES                                                     │
│        (28, 'https://fal.ai/xxx', 'lifestyle', 'completed'),   │
│        (28, 'https://fal.ai/yyy', 'infographic', 'completed'), │
│        (28, 'https://fal.ai/zzz', 'detail', 'completed');      │
│                                                                 │
│      // 5. Ürün statusu güncelle                               │
│      UPDATE products SET status = 'completed' WHERE id = 28    │
│    }                                                            │
│                                                                 │
│    sleep(1000); // 1 saniye bekle                              │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ▶️ ADIM 8: Frontend Sonuçları Gösteriyor

Frontend polling ile kontrol eder:
```javascript
// Her 2 saniyede bir kontrol et
setInterval(async () => {
  const response = await fetch('/products/28');
  if (response.productStatus === 'completed') {
    // Sayfayı güncelle, AI içerikleri göster
    showResults();
  }
}, 2000);
```

---

## 📊 VERİTABANI SONUÇ DURUMU

```sql
-- products tablosu
SELECT * FROM products WHERE id = 28;
-- id: 28, status: 'completed', brand_name: 'Philips'

-- product_source_images tablosu
SELECT * FROM product_source_images WHERE product_id = 28;
-- id: 1, image_url: '/uploads/product_28_1234.jpg'

-- marketplace_listings tablosu
SELECT * FROM marketplace_listings WHERE product_id = 28;
-- id: 101, marketplace_id: 1, title: 'Philips Espresso Makinesi ☕✨'
-- id: 102, marketplace_id: 2, title: 'Philips Otomatik Kahve Makinesi 💎'
-- id: 103, marketplace_id: 3, title: 'Philips Automatic Espresso Machine'

-- ai_enhanced_images tablosu
SELECT * FROM ai_enhanced_images WHERE product_id = 28;
-- id: 201, type: 'lifestyle', url: 'https://fal.ai/xxx'
-- id: 202, type: 'infographic', url: 'https://fal.ai/yyy'
-- id: 203, type: 'detail', url: 'https://fal.ai/zzz'
```

---

## 🔄 TAM AKIŞ ÖZETİ

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       TAM SİSTEM AKIŞI                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐     HTTP      ┌──────────┐     SQL      ┌──────────────┐  │
│  │ FRONTEND │ ───────────▶  │ BACKEND  │ ──────────▶  │   DATABASE   │  │
│  │ (React)  │ ◀───────────  │  (Hono)  │ ◀──────────  │ (PostgreSQL) │  │
│  └──────────┘     JSON      └──────────┘    Data      └──────────────┘  │
│       │                          │                          │            │
│       │                          │                          │            │
│       │                     ┌────┴────┐                     │            │
│       │                     │   AI    │                     │            │
│       │                     │ Service │                     │            │
│       │                     └────┬────┘                     │            │
│       │                          │                          │            │
│       │              ┌───────────┼───────────┐              │            │
│       │              │           │           │              │            │
│       │              ▼           ▼           ▼              │            │
│       │         ┌────────┐  ┌────────┐  ┌────────┐          │            │
│       │         │ GPT-4o │  │ Fal.ai │  │ Queue  │          │            │
│       │         │ (Text) │  │(Image) │  │Processor           │            │
│       │         └────────┘  └────────┘  └────────┘          │            │
│       │                                                      │            │
│  localhost:3000         localhost:8881              localhost:5432       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ SUNUM ÖNCESİ CHECKLIST

- [ ] Backend çalışıyor: `http://localhost:8881`
- [ ] Swagger UI açık: `http://localhost:8881/api-docs`
- [ ] Admin hesabı hazır: `admin@test.com / admin123`
- [ ] VS Code'da dosyalar açık:
  - [ ] `src/` (klasör yapısı)
  - [ ] `src/modules/auth/auth.routes.ts`
  - [ ] `src/modules/admin/admin.service.ts` (satır 48-74)
  - [ ] `src/app.ts`

---

## 🎯 HOCA SORULARINI TAHMİN

### ❓ "Neden ORM kullandınız?"
> "Type-safety, SQL injection koruması, IDE desteği. Ama karmaşık sorgularda raw SQL de yazabiliyoruz."

### ❓ "Frontend backend'le nasıl haberleşiyor?"
> "HTTP REST API. Frontend fetch ile istek gönderiyor, backend JSON döndürüyor. JWT token ile kimlik doğrulama yapılıyor."

### ❓ "Queue neden var?"
> "Görsel üretimi 30 saniye sürebilir. Kullanıcıyı o kadar bekletmemek için arka planda işliyoruz."

### ❓ "Güvenlik nasıl sağlanıyor?"
> "JWT token, rate limiting, Zod validation, bcrypt şifreleme, SQL injection koruması."

---

**Başarılar! 🚀**
