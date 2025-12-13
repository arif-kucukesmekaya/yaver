# YAVER 🚀

**AI-Powered E-commerce Content Optimization Platform**

YAVER, e-ticaret satıcıları için AI destekli ürün içerik üretim platformudur. Tek bir ürün açıklamasından Trendyol, Hepsiburada ve Amazon için optimize edilmiş listeler oluşturur.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Hono](https://img.shields.io/badge/Hono-4.6-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Bun](https://img.shields.io/badge/Bun-1.0-pink)

---

## ✨ Özellikler

- 🤖 **AI İçerik Üretimi** - OpenAI/Gemini ile otomatik başlık ve açıklama
- 🛒 **Multi-Marketplace** - Trendyol, Hepsiburada, Amazon desteği
- 💳 **Kredi Sistemi** - Kullanım bazlı ücretlendirme
- 📊 **Dashboard** - Modern, responsive yönetim paneli
- 🔐 **JWT Auth** - Güvenli kimlik doğrulama
- 📱 **Mobile Ready** - Tüm cihazlarda çalışır

---

## 🛠️ Teknolojiler

### Backend
- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT (Access + Refresh Token)
- **AI:** OpenAI GPT-4 / Google Gemini

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- [Bun](https://bun.sh/) >= 1.0
- [PostgreSQL](https://www.postgresql.org/) >= 14
- OpenAI API Key (opsiyonel)

### Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/arif-kucukesmekaya/sellerai.git
cd sellerai

# 2. Bağımlılıkları yükle
bun install
cd frontend && bun install && cd ..

# 3. Environment dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle

# 4. Veritabanını oluştur
bun run db:push
bun run db:seed

# 5. Tüm sistemi başlat
./start.sh
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yaver_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# AI (en az birini ekle)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Server
PORT=8881
NODE_ENV=development
```

---

## � Proje Yapısı

```
sellerai/
├── src/                    # Backend (Hono)
│   ├── core/               # Database, config
│   ├── modules/            # Auth, Products, AI, Credits
│   └── shared/             # Middleware, utils
├── frontend/               # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # Pages (App Router)
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # API client, utils
│   │   └── types/          # TypeScript types
├── drizzle/                # Database migrations
├── start.sh                # Unified start script
└── package.json
```

---

## 🖥️ Kullanım

### Sistemi Başlatma

```bash
# Tek komutla tüm sistem
./start.sh

# veya
bun run start:all
```

**Erişim Adresleri:**
| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3001 |
| Dashboard | http://localhost:3001/dashboard |
| Backend API | http://localhost:8881 |
| API Docs | http://localhost:8881/api-docs |

### Test Kullanıcısı

```
Email: test@yaver.com
Password: Test123!
```

---

## � API Endpoints

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register` | Kayıt ol |
| POST | `/auth/login` | Giriş yap |
| POST | `/auth/refresh` | Token yenile |
| GET | `/auth/me` | Profil bilgisi |

### Products
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/products` | Ürün listesi |
| POST | `/products` | Yeni ürün |
| GET | `/products/:id` | Ürün detay |
| DELETE | `/products/:id` | Ürün sil |

### AI
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/ai/generate-content` | İçerik üret |
| POST | `/ai/preview` | Önizleme |

### Credits
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/credits` | Bakiye |
| GET | `/credits/history` | İşlem geçmişi |
| POST | `/credits/purchase` | Kredi satın al |

---

## �️ Veritabanı

### Tablolar

- `users` - Kullanıcılar
- `products` - Ürünler
- `product_source_images` - Ürün görselleri
- `marketplace_listings` - Pazaryeri içerikleri
- `marketplaces` - Pazaryeri tanımları
- `marketplace_configs` - Pazaryeri ayarları
- `categories` - Kategoriler
- `credits` - Kredi bakiyeleri
- `credit_transactions` - Kredi işlemleri

### Drizzle Komutları

```bash
bun run db:generate   # Migration oluştur
bun run db:push       # Şemayı uygula
bun run db:studio     # Drizzle Studio aç
bun run db:seed       # Örnek veri ekle
```

---

## 🔧 Geliştirme

```bash
# Backend dev
bun run dev

# Frontend dev
cd frontend && bun run dev

# Build
cd frontend && bun run build

# Type check
bun run typecheck

# Lint
bun run lint
```

---

## 📝 Lisans

MIT License - Özgürce kullanabilirsiniz.

---

## 👨‍💻 Geliştirici

**Arif Küçükesmekaya**

- GitHub: [@arif-kucukesmekaya](https://github.com/arif-kucukesmekaya)
