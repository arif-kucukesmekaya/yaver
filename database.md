### MODÜL 1: Kimlik ve Yetkilendirme (Identity & Auth)

_Amaç: Güvenlik ve kullanıcı bilgilerini yönetmek._

**1\. users (Ana Kullanıcılar)**

*   id (PK)
*   email (Unique)
*   password_hash (hashed)
*   created_at, updated_at

**2\. user_profiles (Profil Detayları)**

*   user_id (PK, FK -> users)
*   first_name, last_name
*   phone_number
*   company_name
*   created_at, updated_at

**3\. roles (Rol Tanımları)**

*   id (PK)
*   role_name (Admin, Satıcı, Editör)
*   created_at, updated_at

**4\. user_roles (Kullanıcı - Rol Eşleşmesi)**

*   user_id (FK)
*   role_id (FK)
*   PRIMARY KEY (user_id, role_id)  
    _Sebep:_ Many-to-many, duplicate engeli.
*   created_at, updated_at

### MODÜL 2: Finans ve Abonelik (SaaS & Finance)

_Amaç: Para akışı, abonelik ve kredi yönetimi._

**5\. subscription_plans (Paketler)**

*   id (PK)
*   name (Free, Pro, Enterprise)
*   price
*   monthly_credit_limit
*   created_at, updated_at

**6\. user_subscriptions (Aktif Abonelikler)**

*   id (PK)
*   user_id (FK)
*   plan_id (FK)
*   start_date, end_date
*   is_active
*   created_at, updated_at

**7\. payments (Ödeme Geçmişi)**

*   id (PK)
*   user_id (FK)
*   amount
*   payment_date
*   created_at, updated_at

**8\. credit_transactions (Kredi Hareketleri)**

*   id (PK)
*   user_id (FK)
*   amount (pozitif: refill/satın alma, negatif: kullanım)
*   transaction_type (purchase, monthly_refill, usage, bonus)
*   description (TEXT)
*   related_product_id (FK, nullable)
*   created_at

**9\. user_credits (Anlık Bakiye Cache)**

*   user_id (PK, FK)
*   available_credits
*   total_earned
*   total_spent
*   last_refill_date
*   updated_at

Kredi kuralı: Trendyol=1, Hepsiburada=1, Amazon=2 kredi. Ay başı refill, kümülatif değil; ek kredi satın alınabilir.

### MODÜL 3: Pazaryeri Entegrasyonu (Marketplace Core)

_Amaç: Platform bilgisi ve kurallarını yönetmek._

**10\. marketplaces (Platform Tanımları)**

*   id (PK)
*   name (Trendyol, Hepsiburada, Amazon)
*   api_base_url
*   logo_url
*   created_at, updated_at

**11\. marketplace_configs (JSONB Kurallar)**

*   id (PK)
*   marketplace_id (FK)
*   config (JSONB): max_title_length, description_max_length, language, banned_words, required_fields, format, keyword_density vb.
*   created_at, updated_at

_Not:_ Eski marketplace_rules yerine tip-güvenli JSONB config.
w
**JSONB Kullanımının Teknik Gerekçesi (Hocaya Sunmalık):**

✅ **Neden JSONB Seçtik?**
- **Heterojen Veri Yapısı:** Trendyol, Hepsiburada ve Amazon'un kural yapıları birbirinden farklı. Trendyol'un `max_title_length: 100` varken, Amazon'un `bullet_points: true, keyword_density: 5%` gibi özgün kuralları var.
- **Normalize Edilmiş Alternatif (EAV Pattern):** İlişkisel tabloda tutmak için ~50+ kolon açmamız gerekirdi. Bunların çoğu NULL olacaktı (örn: Trendyol satırında `bullet_points` NULL).
- **Veritabanı Şişmesi:** NULL kolonlar disk alanı tüketir ve sorgu performansını düşürür.
- **Esneklik:** Yeni bir pazaryeri (örn: eBay) eklendiğinde, schema migration gerektirmeden config eklenebilir.
- **PostgreSQL JSONB Avantajları:** Binary format (hızlı), indexlenebilir (GIN), sorgulanabilir (jsonb_path_query).

**Örnek JSONB Yapısı:**
```json
// Trendyol Config
{
  "max_title_length": 100,
  "description_max_length": 3000,
  "language": "tr",
  "banned_words": ["garanti", "kesin"],
  "format": "plain_text",
  "seo_keywords_required": true
}

// Amazon Config
{
  "max_title_length": 200,
  "description_format": "html",
  "language": "en",
  "bullet_points": true,
  "bullet_point_max": 5,
  "keyword_density": 0.05,
  "a_plus_content_supported": true
}
```

**Hocaya Cevap Hazırlığı:**  
_"Hocam, marketplace_configs'i JSONB yaptık çünkü her pazaryerinin kuralları tamamen farklı. İlişkisel tabloda normalize etseydik, 50+ kolon açmamız gerekecekti ve çoğu satırda bu kolonlar NULL olacaktı. Bu hem disk alanını gereksiz şişirir, hem de sorgu performansını düşürür. JSONB ile hem esneklik kazandık (yeni pazaryeri eklerken schema değişikliği yok), hem de PostgreSQL'in GIN indeksleme desteğiyle performanslı sorgulama yapabiliyoruz. Ayrıca jsonb_path_query ile SQL içinde JSON sorguları çalıştırabiliyoruz."_

### MODÜL 4: Ürün ve Girdi (Input Engine)

_Amaç: Kullanıcının yüklediği ham veriyi saklamak._

**12\. categories (Kategori Ağacı)**

*   id (PK)
*   parent_id (FK -> categories, nullable)
*   name
*   created_at, updated_at

**13\. products (Ana Ürün)**

*   id (PK)
*   user_id (FK)
*   category_id (FK)
*   brand_name
*   raw_user_prompt (TEXT)
*   product_status ENUM('draft','processing','completed','failed')
*   created_at, updated_at

**14\. product_source_images (Ham Resimler)**

*   id (PK)
*   product_id (FK)
*   image_url
*   created_at, updated_at

**15\. product_marketplace_selections (Seçilen Pazaryerleri)**

*   product_id (FK)
*   marketplace_id (FK)
*   is_selected (Boolean)
*   PRIMARY KEY (product_id, marketplace_id)
*   created_at, updated_at

### MODÜL 5: AI Çıktıları ve Listeleme (Output Engine)

_Amaç: AI tarafından üretilmiş satışa hazır veriler._

**16\. marketplace_listings (Kalp Tablo)**

*   id (PK)
*   product_id (FK)
*   marketplace_id (FK)
*   generated_title
*   generated_description (TEXT/HTML)
*   listing_status (Draft, Published, Error)
*   created_at, updated_at

**17\. ai_enhanced_images (İşlenmiş Resimler)**

*   id (PK)
*   product_id (FK)
*   image_url (Gemini/Nano Banana çıktısı)
*   created_at, updated_at

### MODÜL 6: İşleme Kuyruğu ve Hata Yönetimi

**18\. image_processing_queue**

*   id (PK)
*   product_id (FK)
*   source_image_url
*   status (pending, processing, completed, failed)
*   gemini_job_id (Nano Banana dönüşü)
*   retry_count
*   created_at, updated_at

**19\. generation_errors**

*   id (PK)
*   product_id (FK)
*   marketplace_id (FK)
*   error_type (api_timeout, invalid_image, quota_exceeded vb.)
*   error_message (TEXT)
*   retry_count (default 0)
*   resolved (Boolean, default false)
*   last_retry_at (Timestamp, nullable)
*   created_at, updated_at

### Güvenlik ve Operasyon Notları

*   API anahtarları plaintext tutulmaz; gerekirse pgcrypto ile encrypt-at-rest (MVP'de kullanıcı anahtarı saklanmıyor).
*   Rate limiting ürün oluşturma uç noktasında uygulanacak.
*   Dosya yükleme validasyonu: MIME, boyut, gerçek resim kontrolü.
*   Audit log MVP'de yok; sistem logları dosyaya (app.log, error.log, ai-requests.log).

### Index Stratejisi

*   marketplace_listings: INDEX (product_id, marketplace_id) composite
*   products: INDEX (user_id, created_at)
*   marketplace_listings: GIN FULL TEXT (generated_title, generated_description)
*   product_marketplace_selections: PK (product_id, marketplace_id) zaten index
*   credit_transactions: INDEX (user_id, created_at)
*   generation_errors: INDEX (product_id, marketplace_id)

### Proje İstatistikleri (Hocaya Sunmalık)

*   **Toplam Tablo:** 19 Adet
*   **İlişki Türleri:**
*   One-to-One (users -> user_profiles)
*   One-to-Many (products -> marketplace_listings)
*   Many-to-Many (users <-> roles)
*   Recursive (categories -> categories)
*   **Veri Tipleri:** JSONB, TEXT, TIMESTAMP, BOOLEAN, INTEGER, ENUM.
*   **Trigger Fonksiyonları:** 2 Adet (update_user_balance, update_timestamp)
*   **Aktif Trigger:** 18 Adet (1 balance trigger + 17 timestamp trigger)
*   **Gelişmiş PostgreSQL Özellikleri:**
    - JSONB ile esnek veri modelleme
    - GIN indeksleme (full-text + JSONB)
    - Otomatik bakiye hesaplama (trigger)
    - Otomatik timestamp yönetimi (trigger)
    - Composite Primary Keys (many-to-many)
    - Recursive Foreign Keys (kategori ağacı)

### Bun + Drizzle Kurulum ve Migration Akışı

Gerekenler: Bun, PostgreSQL, Drizzle Kit.

Örnek `drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

Komutlar (npm yok, Bun ile):
```
bun install drizzle-kit

# SQL migration üret
bun x drizzle-kit generate:pg

# Migration çalıştır
bun x drizzle-kit migrate

# ORM tiplerini üretmek için (opsiyonel)
bun x drizzle-kit push
```

### Seed Planı (Bun script)

1) Marketplaces + marketplace_configs (Trendyol, HB, Amazon)
2) Roles (admin, satici), örnek kullanıcı + user_profile
3) subscription_plans (Free, Pro), user_subscriptions
4) user_credits (plan limitine göre başlangıç bakiyesi)
5) categories (örnek: Elektronik)

Seed dosyası için örnek komut:
```
bun run scripts/seed.ts
```

`seed.ts` içerik özet:
```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
    // marketplaces, configs, roles, user, subscription, credits, categories insert
}

main().finally(() => pool.end());
```

### PostgreSQL Notları

* GIN full-text için `CREATE EXTENSION IF NOT EXISTS pg_trgm;` (gerekirse)
* Şifreleme ilerisi için `pgcrypto` (MVP'de kullanıcı anahtarı saklanmıyor)
* `.env`: `DATABASE_URL=postgres://user:pass@localhost:5432/sellerai`

### PostgreSQL Trigger Fonksiyonları ve Otomasyonlar

**1. Otomatik Bakiye Hesaplama Trigger'ı**

_Amaç:_ `credit_transactions` tablosuna her satır eklendiğinde `user_credits` bakiyesini otomatik güncelle. Bu, backend kodunda manuel güncelleme unutulmasını engeller ve veri tutarlılığını garanti eder.

```sql
-- Trigger Fonksiyonu
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Yeni işlem eklendiğinde, kullanıcının bakiyesini güncelle
    UPDATE user_credits
    SET 
        available_credits = available_credits + NEW.amount,
        total_spent = CASE WHEN NEW.amount < 0 THEN total_spent + ABS(NEW.amount) ELSE total_spent END,
        total_earned = CASE WHEN NEW.amount > 0 THEN total_earned + NEW.amount ELSE total_earned END,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger Tanımı
CREATE TRIGGER trigger_update_balance
AFTER INSERT ON credit_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_balance();
```

**Avantajları:**
- ✅ Veri tutarlılığı garanti altında
- ✅ Backend kodu basitleşir (tek INSERT yeterli)
- ✅ Race condition riski minimize
- ✅ Muhasebe mantığı merkezi bir yerde

**2. Otomatik updated_at Güncelleme Trigger'ı**

_Amaç:_ `updated_at` sütunu olan her tabloda, UPDATE işleminde bu sütunu otomatik güncelle. Manuel timestamp yönetimi hatalarını engeller.

```sql
-- Genel Timestamp Güncelleme Fonksiyonu
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Her tablo için trigger tanımı (updated_at olan tablolar)
CREATE TRIGGER set_timestamp_users 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_user_profiles 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_roles 
    BEFORE UPDATE ON roles 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_user_roles 
    BEFORE UPDATE ON user_roles 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_subscription_plans 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_user_subscriptions 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_payments 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_marketplaces 
    BEFORE UPDATE ON marketplaces 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_marketplace_configs 
    BEFORE UPDATE ON marketplace_configs 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_categories 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_products 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_product_source_images 
    BEFORE UPDATE ON product_source_images 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_product_marketplace_selections 
    BEFORE UPDATE ON product_marketplace_selections 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_marketplace_listings 
    BEFORE UPDATE ON marketplace_listings 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_ai_enhanced_images 
    BEFORE UPDATE ON ai_enhanced_images 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_image_processing_queue 
    BEFORE UPDATE ON image_processing_queue 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_generation_errors 
    BEFORE UPDATE ON generation_errors 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

**Avantajları:**
- ✅ Timestamp yönetimi tamamen otomatik
- ✅ Uygulama kodu temiz kalır
- ✅ Audit trail güvenilirliği artar
- ✅ İnsan hatası riski sıfırlanır

### Index ve Constraint Kontrol Listesi

- Composite PK: `user_roles (user_id, role_id)`, `product_marketplace_selections (product_id, marketplace_id)`
- Composite index: `marketplace_listings (product_id, marketplace_id)`
- Time-ordered index: `products (user_id, created_at)`
- Full-text GIN: `marketplace_listings (generated_title, generated_description)`
- Foreign keys: tüm FK'lerde ON DELETE CASCADE düşünülerek tanımlanabilir (ödev gereksinimine göre karar verilir).