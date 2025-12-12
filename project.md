📄 Product Requirement Document (PRD) - Revize
==============================================

**Proje Adı:** SellerAI (E-Ticaret İçerik Fabrikası)  
**Versiyon:** 2.0 (Landing Page + Dashboard Odaklı)  
**Tarih:** 11.12.2025  
**Kapsam:** Trendyol, Hepsiburada, Amazon

1\. Proje Özeti (Executive Summary)
-----------------------------------

SellerAI, e-ticaret satıcılarının ürünlerini pazaryerlerine yüklemeden önce içeriklerini (Başlık, Açıklama, Görsel) optimize eden yapay zeka destekli bir SaaS (Software as a Service) platformudur.

Proje iki ana bacaktan oluşur:

1.  **Landing Page (Pazarlama Yüzü):** Ziyaretçiyi karşılayan, ürünün yeteneklerini (Before/After) gösteren, referansların olduğu ve kullanıcıyı "Hemen Dene" diyerek kayıta ikna eden modern web sayfası.
    
2.  **Dashboard (Yönetim Paneli):** Kayıt olan kullanıcının ürün resmini yükleyip; Trendyol, Hepsiburada ve Amazon için özelleştirilmiş çıktılarını aldığı uygulama ekranı.
    

2\. Kullanıcı Akışı (User Flow)
-------------------------------

1.  **Ziyaret (Landing Page):** Kullanıcı sellerai.com'a (localhost) gelir. "Yapay Zeka ile Satışlarını 3'e Katla" sloganını görür. Örnek ürün dönüşümlerini inceler.
    
2.  **İkna & Kayıt:** "Ücretsiz Dene" butonuna basar -> Kayıt Ekranına (Register) yönlenir.
    
3.  **Onboarding (Dashboard):** Kayıttan sonra temiz bir panele düşer.
    
4.  **Eylem (Upload):**
    
    *   Ürün resmini yükler.
        
    *   Kısa özelliklerini yazar (Örn: "Deri ceket, siyah, kışlık").
        
5.  **Sonuç (Magic):** Sistem arka planda çalışır ve kullanıcıya 3 kart gösterir:
    
    *   **Trendyol Kartı:** Kısa, Türkçe, SEO uyumlu başlık + Açıklama.
    
    *   **Hepsiburada Kartı:** Kurumsal dilde başlık + Özellik listesi.
    
    *   **Amazon Kartı:** İngilizce, uzun, bol anahtar kelimeli başlık (Bullet points ile).
        

3\. Sayfa Yapısı ve Gereksinimler
---------------------------------

### 3.1. Landing Page (Vitrin)

Modern, hızlı ve etkileyici bir tasarım (Next.js + Tailwind).

*   **Hero Section:** Büyük başlık, açıklama ve "Kayıt Ol" butonu. Yan tarafta havada duran 3D veya şık bir ürün görseli.
    
*   **Features (Özellikler):**
    
    *   "Tek Tıkla 3 Pazaryeri"
        
    *   "Amazon İçin İngilizce Çeviri"
        
    *   "SEO Uyumlu Başlıklar"
        
*   **Showcase (Before/After):**
    
*   _Girdi:_ "Siyah ayakkabı" (Kötü foto)
        
*   _Çıktı:_ "Premium Hakiki Deri Ortopedik Erkek Ayakkabı" (İyi foto)
        
*   **Testimonials (Referanslar):** "Satışlarım P arttı" diyen (Fake) kullanıcı yorumları.
    
*   **Footer:** Linkler ve Logo.
    

3.2. Dashboard (Uygulama)

*   **Sidebar:** Ürünlerim, Yeni Ekle, Ayarlar, Çıkış.
    
*   **Create Product Sayfası:**
    
    *   Resim Yükleme Alanı (Drag & Drop).
        
    *   "Bize ürünü anlat" text alanı (Serbest metin).
        
    *   "Oluştur" Butonu.
        
*   **Product Detail Sayfası (Sonuç Ekranı):**
    
    *   Sol taraf: Yüklenen Orijinal Resim.
        
    *   Sağ taraf: Tab'lı yapı (Trendyol | Hepsiburada | Amazon). Her tab'da o pazaryerine özel üretilmiş metinler.
        

4\. Desteklenen Pazaryerleri ve Kuralları

Sistem şu an için sadece bu 3 devi destekler:

**1\. Trendyol** Türkçe. Kısa, vurucu, marka önde. Max 100 karakter.  
**Örnek:** "Mavi Jeans Erkek Siyah Kot Pantolon Slim Fit"

**2\. Hepsiburada** Türkçe. Detaylı, kategori bazlı. Max 150 karakter.  
**Örnek:** "Mavi Jeans Erkek Pantolon Siyah Renk Mevsimlik Pamuklu Kumaş"

**3\. Amazon** İngilizce. Uzun, bol keyword, özellik odaklı. Max 200 karakter.  
**Örnek:** "Mavi Jeans Men's Black Denim Pants Slim Fit Cotton Stretch Casual Trousers for Daily Use"

Kurallar merkezi bir JSONB config ile yönetilir (max length, banned words, dil, format vb.).

5. Teknik Mimari (Tech Stack)

*   **Frontend (Landing & Dash):** Next.js 14 (App Router), Tailwind CSS, Framer Motion (Animasyonlar için).
    
*   **Backend API:** Bun Runtime + ElysiaJS Framework.
    
*   **AI:** GPT-4 (title + description), Gemini (Nano Banana API) ile görsel iyileştirme.
    
*   **Veritabanı:** PostgreSQL (Docker üzerinde).
    
*   **ORM:** Drizzle ORM.
    

6\. Veritabanı Gereksinimleri (Özet)
------------------------------------

Landing page statik; yük dashboard tarafında. Ana tablolar:

1.  **users, user_profiles, roles, user_roles (composite PK)**
2.  **subscription_plans, user_subscriptions, payments**
3.  **marketplaces, marketplace_configs (JSONB ile kurallar)**
4.  **categories, products (status enum + timestamps), product_source_images**
5.  **product_marketplace_selections** (hangi pazaryerleri seçildi)
6.  **marketplace_listings** (AI metinler + indexler)
7.  **ai_enhanced_images** (Gemini çıktıları)
8.  **credit_transactions, user_credits** (aylık refill + harcama)
9.  **generation_errors, image_processing_queue** (asenkron işleme/hata takibi)

Kritik indexler: (product_id, marketplace_id) composite index; products üzerinde (user_id, created_at); full-text için generated_title/description GIN.

**Veritabanı Otomasyonları (PostgreSQL Triggers):**

*   **Otomatik Bakiye Hesaplama:** `credit_transactions` tablosuna INSERT edildiğinde `user_credits` otomatik güncellenir. Backend kodu basitleşir, veri tutarlılığı garanti altına alınır.
*   **Otomatik Timestamp Güncelleme:** `updated_at` sütunu olan tüm tablolarda (17 adet) UPDATE işlemlerinde otomatik güncelleme yapılır.
*   **JSONB Config Rasyoneli:** Her pazaryerinin farklı kural yapısı için JSONB kullanımı. Alternatif (50+ kolon) veri tabanını şişirir ve performansı düşürürdü.
    

7\. Başarı Kriterleri (Demo Günü)
---------------------------------

1.  Hoca Landing Page'i açtığında "Ooo, profesyonel bir site gibi duruyor" demeli.
    
2.  "Ücretsiz Dene" butonuna basıp kayıt olabilmeli.
    
3.  Bir fotoğraf yükleyip "Oluştur" dediğinde, veritabanına 3 farklı satırın (Trendyol, HB, Amazon) eklendiğini canlı olarak görebilmeli.

4.  **Bonus (Hocayı Etkileyecek):** `credit_transactions` tablosuna manuel INSERT yapıldığında, `user_credits.available_credits` değerinin trigger ile otomatik güncellendigini göstermek. "Hocam, bakiye hesaplamasını veritabanına yıktık, backend kodu temiz kaldı" diyebilmek.

8\. Operasyonel Kurallar
------------------------

*   Rate limiting: Ürün oluşturma uç noktası throttled.
*   File upload validasyonu: MIME/type, boyut ve görüntü doğrulama.
*   Kredi modeli: Trendyol=1, Hepsiburada=1, Amazon=2 kredi. Ay başı refill; kümülatif değil. Ek kredi satın alma desteklenir.
*   Loglama: Uygulama logları dosyaya (app/error/ai-requests). Audit log V1'de yok; generation_errors tabloya yazılır.