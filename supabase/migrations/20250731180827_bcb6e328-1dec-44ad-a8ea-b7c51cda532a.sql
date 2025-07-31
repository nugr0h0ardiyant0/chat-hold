-- Update PembelianManager to use Order table instead of pembelian
-- And fix DailyMetrics to auto-update from real data

-- Drop the pembelian table since we'll use Order table
DROP TABLE IF EXISTS pembelian CASCADE;

-- Add missing columns to Order table for better tracking
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS ringkasan text;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS total_pembayaran numeric;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS proses boolean NOT NULL DEFAULT false;

-- Update store_daily_metrics function to use real current data
CREATE OR REPLACE FUNCTION public.store_daily_metrics(target_date date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  chat_count INTEGER;
  complaint_count INTEGER;
  checkout_count INTEGER;
BEGIN
  -- Get chat count (unique users updated on target date)
  SELECT COUNT(DISTINCT phone_number)::integer INTO chat_count
  FROM "User"
  WHERE DATE(updated_at) = target_date;
  
  -- Get complaint count
  SELECT COUNT(*)::integer INTO complaint_count
  FROM "Keluhan"
  WHERE DATE("Datetime") = target_date;
  
  -- Get checkout count from Order table with status PROCESSING
  SELECT COUNT(*)::integer INTO checkout_count
  FROM "Order"
  WHERE status = 'PROCESSING' AND DATE(created_at) = target_date;
  
  -- Insert or update daily metrics with current real data
  INSERT INTO "DailyMetrics" (
    date, 
    total_chats, 
    total_complaints, 
    total_checkouts,
    pelanggan_tanya,
    masuk_keranjang,
    inisiasi_payment_belum_bayar,
    invoice_gagal_bayar,
    sudah_bayar,
    keluhan,
    updated_at
  )
  SELECT 
    target_date,
    chat_count,
    complaint_count,
    checkout_count,
    COALESCE(SUM(CASE WHEN customer_journey = 'pelanggan_tanya' THEN 1 ELSE 0 END), 0)::integer,
    COALESCE(SUM(CASE WHEN customer_journey = 'masuk_keranjang' THEN 1 ELSE 0 END), 0)::integer,
    COALESCE(SUM(CASE WHEN customer_journey = 'inisiasi_payment_belum_bayar' THEN 1 ELSE 0 END), 0)::integer,
    COALESCE(SUM(CASE WHEN customer_journey = 'invoice_gagal_bayar' THEN 1 ELSE 0 END), 0)::integer,
    COALESCE(SUM(CASE WHEN customer_journey = 'sudah_bayar' THEN 1 ELSE 0 END), 0)::integer,
    COALESCE(SUM(CASE WHEN customer_journey = 'keluhan' THEN 1 ELSE 0 END), 0)::integer,
    NOW()
  FROM "CustomerJourney"
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date) 
  DO UPDATE SET
    total_chats = EXCLUDED.total_chats,
    total_complaints = EXCLUDED.total_complaints,
    total_checkouts = EXCLUDED.total_checkouts,
    pelanggan_tanya = EXCLUDED.pelanggan_tanya,
    masuk_keranjang = EXCLUDED.masuk_keranjang,
    inisiasi_payment_belum_bayar = EXCLUDED.inisiasi_payment_belum_bayar,
    invoice_gagal_bayar = EXCLUDED.invoice_gagal_bayar,
    sudah_bayar = EXCLUDED.sudah_bayar,
    keluhan = EXCLUDED.keluhan,
    updated_at = NOW();
END;
$function$;

-- Create function to auto-update today's metrics
CREATE OR REPLACE FUNCTION auto_update_daily_metrics()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM store_daily_metrics(CURRENT_DATE);
END;
$function$;

-- Run the function now to update today's data
SELECT auto_update_daily_metrics();

-- Create triggers to auto-update DailyMetrics when data changes
CREATE OR REPLACE FUNCTION trigger_update_daily_metrics()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update today's metrics whenever relevant data changes
  PERFORM auto_update_daily_metrics();
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Add triggers for automatic updates
DROP TRIGGER IF EXISTS trigger_update_daily_metrics_user ON "User";
CREATE TRIGGER trigger_update_daily_metrics_user
  AFTER INSERT OR UPDATE OR DELETE ON "User"
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_daily_metrics();

DROP TRIGGER IF EXISTS trigger_update_daily_metrics_keluhan ON "Keluhan";
CREATE TRIGGER trigger_update_daily_metrics_keluhan
  AFTER INSERT OR UPDATE OR DELETE ON "Keluhan"
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_daily_metrics();

DROP TRIGGER IF EXISTS trigger_update_daily_metrics_order ON "Order";
CREATE TRIGGER trigger_update_daily_metrics_order
  AFTER INSERT OR UPDATE OR DELETE ON "Order"
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_daily_metrics();

DROP TRIGGER IF EXISTS trigger_update_daily_metrics_journey ON "CustomerJourney";
CREATE TRIGGER trigger_update_daily_metrics_journey
  AFTER INSERT OR UPDATE OR DELETE ON "CustomerJourney"
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_daily_metrics();