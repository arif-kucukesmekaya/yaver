# SellerAI - E-Ticaret İçerik Optimizasyon Platformu

A platform that enables e-commerce sellers to manage product titles, descriptions, and images using AI for all their marketplaces from a single place.

AI destekli SaaS çözümü ile Trendyol, Hepsiburada ve Amazon için otomatik içerik üretimi.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle
```bash
bun install
```

### 2. Veritabanı Kurulumu
```bash
# .env dosyasını oluştur
cp .env.example .env

# Migration'ları çalıştır
bun run db:migrate

# Trigger fonksiyonlarını ekle
psql $DATABASE_URL -f drizzle/triggers.sql

# Seed verilerini yükle
bun run db:seed
```

## 📊 Veritabanı İstatistikleri

- **Toplam Tablo:** 19 Adet
- **Trigger Fonksiyonu:** 2 Adet
- **Aktif Trigger:** 18 Adet
- **Enum Tipler:** 4 Adet (product_status, listing_status, transaction_type, queue_status)

### Modüller:
1. **Kimlik & Auth:** users, user_profiles, roles, user_roles
2. **Finans:** subscription_plans, user_subscriptions, payments, credit_transactions, user_credits
3. **Pazaryeri:** marketplaces, marketplace_configs (JSONB)
4. **Ürün:** categories, products, product_source_images, product_marketplace_selections
5. **AI Çıktı:** marketplace_listings, ai_enhanced_images
6. **İşleme:** image_processing_queue, generation_errors

## 🔥 Özellikler

### Otomatik Bakiye Hesaplama
`credit_transactions` tablosuna INSERT edildiğinde `user_credits` otomatik güncellenir.

```sql
-- Test
INSERT INTO credit_transactions (user_id, amount, transaction_type, description) 
VALUES (1, -3, 'usage', 'Content generation');

-- Bakiye otomatik güncellenir!
SELECT * FROM user_credits WHERE user_id = 1;
```

### Otomatik Timestamp Yönetimi
Her UPDATE işleminde `updated_at` otomatik güncellenir (17 tabloda aktif).

## 🎯 Kredi Sistemi

| Pazaryeri | Kredi Maliyeti |
|-----------|----------------|
| Trendyol | 1 kredi |
| Hepsiburada | 1 kredi |
| Amazon | 2 kredi |

## 📦 Pazaryeri Kuralları (JSONB)

Her pazaryerinin kuralları `marketplace_configs` tablosunda JSONB formatında:

```json
{
  "max_title_length": 100,
  "language": "tr",
  "banned_words": ["garanti", "kesin"],
  "credit_cost": 1
}
```

## 🧪 Demo Kullanıcı

- **Email:** demo@sellerai.com
- **Şifre:** demo123
- **Plan:** Free (10 kredi/ay)
- **Başlangıç Bakiyesi:** 20 kredi

## 📝 Komutlar

```bash
# Development
bun run dev

# Database
bun run db:generate   # Migration dosyası oluştur
bun run db:migrate    # Migration'ları uygula
bun run db:seed       # Test verisi yükle
bun run db:studio     # Drizzle Studio aç

# Veritabanı Yönetimi
psql $DATABASE_URL    # PostgreSQL shell
```

## 🏗️ Tech Stack

- **Runtime:** Bun
- **Backend:** Hono
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **Frontend:** Next.js 14 + Tailwind CSS (gelecek)
- **AI:** GPT-4 (metin) + Gemini (görsel)

## 📈 Proje Durumu

✅ Veritabanı schema tamamlandı  
✅ Trigger'lar aktif  
✅ Seed verisi yüklendi  
✅ Backend API tamamlandı  
✅ Rate limiting aktif  
⏳ Frontend Dashboard (gelecek)  
⏳ Landing Page (gelecek)

## 🔍 Veritabanı Kontrol

```bash
# Tabloları listele
psql $DATABASE_URL -c "\dt"

# Trigger'ları listele
psql $DATABASE_URL -c "SELECT tgname, relname FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid WHERE NOT tgisinternal ORDER BY relname;"

# Kredi durumu
psql $DATABASE_URL -c "SELECT * FROM user_credits;"

# Transaction geçmişi
psql $DATABASE_URL -c "SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;"
```

## 📚 Dokümantasyon

- `database.md` - Detaylı veritabanı dokümantasyonu
- `project.md` - PRD ve proje gereksinimleri
- `rules/` - AI agent kuralları ve operasyonel doktrini

---

**Versiyon:** 2.0.0  
**Son Güncelleme:** 12.12.2025
