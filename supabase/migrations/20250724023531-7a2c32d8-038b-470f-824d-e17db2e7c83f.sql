-- Create table for daily metrics tracking
CREATE TABLE IF NOT EXISTS "DailyMetrics" (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_chats INTEGER DEFAULT 0,
  total_complaints INTEGER DEFAULT 0,
  total_checkouts INTEGER DEFAULT 0,
  pelanggan_tanya INTEGER DEFAULT 0,
  masuk_keranjang INTEGER DEFAULT 0,
  inisiasi_payment_belum_bayar INTEGER DEFAULT 0,
  invoice_gagal_bayar INTEGER DEFAULT 0,
  sudah_bayar INTEGER DEFAULT 0,
  keluhan INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dailymetrics_date ON "DailyMetrics"(date);

-- Function to calculate and store daily metrics
CREATE OR REPLACE FUNCTION store_daily_metrics(target_date date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chat_count INTEGER;
  complaint_count INTEGER;
  checkout_count INTEGER;
  stage_counts RECORD;
BEGIN
  -- Get chat count (unique users updated on target date)
  SELECT COUNT(DISTINCT phone_number)::integer INTO chat_count
  FROM "User"
  WHERE DATE(updated_at) = target_date;
  
  -- Get complaint count
  SELECT COUNT(*)::integer INTO complaint_count
  FROM "Keluhan"
  WHERE DATE("Datetime") = target_date;
  
  -- Get checkout count
  SELECT COUNT(*)::integer INTO checkout_count
  FROM "Order"
  WHERE status = 'PROCESSING' AND DATE(created_at) = target_date;
  
  -- Insert or update daily metrics
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
$$;

-- Function to get daily metrics for date range
CREATE OR REPLACE FUNCTION get_daily_metrics_range(start_date date, end_date date)
RETURNS TABLE(
  date date,
  total_chats integer,
  total_complaints integer,
  total_checkouts integer,
  pelanggan_tanya integer,
  masuk_keranjang integer,
  inisiasi_payment_belum_bayar integer,
  invoice_gagal_bayar integer,
  sudah_bayar integer,
  keluhan integer
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    date,
    total_chats,
    total_complaints,
    total_checkouts,
    pelanggan_tanya,
    masuk_keranjang,
    inisiasi_payment_belum_bayar,
    invoice_gagal_bayar,
    sudah_bayar,
    keluhan
  FROM "DailyMetrics"
  WHERE date BETWEEN start_date AND end_date
  ORDER BY date ASC;
$$;

-- Store metrics for today
SELECT store_daily_metrics();