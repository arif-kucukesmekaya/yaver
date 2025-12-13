# YAVER - Sunum Rehberi 🎯

> **E-ticaret Satıcıları için AI Destekli İçerik Üretim Platformu**

---

## 📌 Slayt 1: Proje Tanıtımı

### YAVER Nedir?
- E-ticaret satıcıları için **AI destekli** ürün içerik üretim platformu
- Bir ürün açıklaması gir → **Tüm pazaryerleri** için optimize içerik al
- Trendyol, Hepsiburada, Amazon desteği

### Problem
- Satıcılar her pazaryeri için ayrı içerik yazıyor
- Zaman kaybı, tutarsız kalite
- SEO optimizasyonu zor

### Çözüm
- **Tek açıklama** → Çoklu optimized çıktı
- AI ile **SEO uyumlu** başlık ve açıklama
- Pazaryeri kurallarına **otomatik uyum**

---

## 📌 Slayt 2: Teknolojiler

### Backend
| Teknoloji | Kullanım |
|-----------|----------|
| **Bun** | JavaScript Runtime (Node.js alternatifi, 3x hızlı) |
| **Hono** | Web Framework (Express alternatifi, TypeScript native) |
| **PostgreSQL** | Veritabanı |
| **Drizzle ORM** | Type-safe veritabanı işlemleri |
| **JWT** | Kimlik doğrulama (Access + Refresh Token) |

### Frontend
| Teknoloji | Kullanım |
|-----------|----------|
| **Next.js 16** | React Framework (App Router) |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animasyonlar |
| **TypeScript** | Type Safety |

### AI
| Provider | Model |
|----------|-------|
| **OpenAI** | GPT-4 / GPT-3.5 |
| **Google Gemini** | Gemini Pro |

---

## 📌 Slayt 3: Mimari

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                  (Next.js + React)                      │
│          http://localhost:3001                          │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API
                      ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│                  (Hono + Bun)                           │
│          http://localhost:8881                          │
├─────────────────────┬───────────────────────────────────┤
│     Auth Module     │    Products Module                │
│     AI Module       │    Credits Module                 │
└─────────────────────┴───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   OpenAI API    │
│   (Database)    │    │   Gemini API    │
└─────────────────┘    └─────────────────┘
```

---

## 📌 Slayt 4: Veritabanı Şeması

### Ana Tablolar

```
users                    products                 marketplace_listings
┌──────────────┐        ┌──────────────┐         ┌──────────────────────┐
│ id           │        │ id           │         │ id                   │
│ email        │◄───────│ user_id      │◄────────│ product_id           │
│ password_hash│        │ brand_name   │         │ marketplace_id       │
│ first_name   │        │ category_id  │         │ generated_title      │
│ last_name    │        │ raw_prompt   │         │ generated_description│
│ created_at   │        │ status       │         │ listing_status       │
└──────────────┘        └──────────────┘         └──────────────────────┘
          │                                                │
          │                                                │
          ▼                                                ▼
┌──────────────┐                                ┌──────────────────────┐
│ credits      │                                │ marketplaces         │
├──────────────┤                                ├──────────────────────┤
│ user_id      │                                │ id                   │
│ available    │                                │ name (Trendyol...)   │
│ total_earned │                                │ api_base_url         │
│ total_spent  │                                │ configs              │
└──────────────┘                                └──────────────────────┘
```

### Tablo Sayıları
- **9 ana tablo** (users, products, listings, marketplaces, categories, credits, transactions, images, configs)
- **PostgreSQL** ilişkisel veritabanı
- **Drizzle ORM** ile type-safe sorgular

---

## 📌 Slayt 5: API Endpoints

### Authentication
```
POST /auth/register     → Kayıt ol
POST /auth/login        → Giriş yap
POST /auth/refresh      → Token yenile
GET  /auth/me           → Profil bilgisi
```

### Products
```
GET    /products        → Ürün listesi
POST   /products        → Yeni ürün oluştur
GET    /products/:id    → Ürün detay
DELETE /products/:id    → Ürün sil
```

### AI Generation
```
POST /ai/generate-content → İçerik üret (kredi harcar)
POST /ai/preview          → Önizleme (ücretsiz)
```

### Credits
```
GET  /credits           → Bakiye sorgula
GET  /credits/history   → İşlem geçmişi
POST /credits/purchase  → Kredi satın al
```

---

## 📌 Slayt 6: Özellikler

### ✅ Tamamlanan
- 🔐 JWT tabanlı kimlik doğrulama
- 📊 Modern dashboard arayüzü
- 🤖 OpenAI / Gemini entegrasyonu
- 💳 Kredi sistemi
- 📱 Responsive tasarım
- 🛒 Multi-marketplace desteği

### 🎨 Arayüz Sayfaları
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Landing | `/` | Tanıtım sayfası |
| Login | `/login` | Giriş |
| Register | `/register` | Kayıt |
| Dashboard | `/dashboard` | Ana panel |
| Products | `/dashboard/products` | Ürün listesi |
| New Product | `/dashboard/products/new` | Ürün ekleme wizard |
| Credits | `/dashboard/credits` | Kredi yönetimi |
| Settings | `/dashboard/settings` | Ayarlar |

---

## 📌 Slayt 7: Kullanım Akışı

```
1. Kullanıcı Kayıt/Giriş
         ↓
2. Ürün Bilgisi Girişi
   • Marka adı
   • Kategori
   • Ürün açıklaması
         ↓
3. Pazaryeri Seçimi
   • Trendyol ✓
   • Hepsiburada ✓
   • Amazon ✓
         ↓
4. AI İçerik Üretimi
   • Kredi kontrolü
   • OpenAI/Gemini çağrısı
   • Pazaryeri kurallarına göre optimize
         ↓
5. Sonuç Görüntüleme
   • Her pazaryeri için ayrı başlık/açıklama
   • Tek tıkla kopyalama
   • Yeniden üretim seçeneği
```

---

## 📌 Slayt 8: Güvenlik

### Authentication
- **JWT Access Token** (7 gün geçerli)
- **Refresh Token** ile yenileme
- Şifreler **bcrypt** ile hash'leniyor

### API Güvenliği
- Rate limiting (istek sınırlama)
- Input validation (Zod schema)
- CORS koruması
- SQL injection koruması (Drizzle ORM)

---

## 📌 Slayt 9: Demo Bilgileri

### Başlatma
```bash
./start.sh
```

### Erişim
| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8881 |
| API Docs | http://localhost:8881/api-docs |
| DB Studio | http://localhost:4983 |

### Test Kullanıcı
```
Email: test@yaver.com
Password: Test123!
```

---

## 📌 Slayt 10: Sonuç

### Kazanımlar
- ⏱️ **Zaman tasarrufu** - Dakikalar içinde içerik
- 📈 **SEO optimizasyonu** - Daha iyi sıralama
- 🎯 **Tutarlılık** - Tüm pazaryerlerinde aynı kalite
- 🔄 **Ölçeklenebilirlik** - Yeni pazaryerleri kolayca eklenebilir

### Gelecek Planları
- 📸 Görsel analizi ile içerik
- 🌍 Çoklu dil desteği
- 📊 Performans analytics
- 🔗 Pazaryeri API entegrasyonu

---

## 📎 Kaynaklar

- **GitHub:** github.com/arif-kucukesmekaya/sellerai
- **Tech Stack:** Bun, Hono, Next.js, PostgreSQL, OpenAI

---

*Hazırlayan: Arif Küçükesmekaya*
