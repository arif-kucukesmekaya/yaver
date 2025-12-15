-- SellerAI PostgreSQL Triggers
-- Bu script veritabanı oluşturulduktan sonra çalıştırılmalıdır

-- ==================== 1. Otomatik Bakiye Hesaplama Trigger'ı ====================
-- credit_transactions tablosuna INSERT yapıldığında user_credits'i otomatik günceller

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

-- Trigger'ı sil (eğer varsa)
DROP TRIGGER IF EXISTS trigger_update_balance ON credit_transactions;

-- Trigger oluştur
CREATE TRIGGER trigger_update_balance
AFTER INSERT ON credit_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_balance();

-- ==================== 2. Otomatik updated_at Güncelleme Trigger'ı ====================
-- updated_at sütunu olan tablolarda UPDATE işleminde bu sütunu otomatik günceller

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eski trigger'ları sil ve yeniden oluştur
DO $$ 
DECLARE
    t TEXT;
    tables TEXT[] := ARRAY[
        'users', 'user_profiles', 'roles', 'user_roles', 
        'subscription_plans', 'user_subscriptions', 'payments',
        'marketplaces', 'marketplace_configs', 'categories', 
        'products', 'product_source_images', 'product_marketplace_selections',
        'marketplace_listings', 'ai_enhanced_images', 'image_processing_queue', 
        'generation_errors'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_timestamp_%s ON %I', t, t);
        EXECUTE format(
            'CREATE TRIGGER set_timestamp_%s BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_timestamp()',
            t, t
        );
        RAISE NOTICE 'Created trigger for table: %', t;
    END LOOP;
END $$;

-- ==================== Verify Triggers ====================
-- Oluşturulan trigger'ları listele
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
