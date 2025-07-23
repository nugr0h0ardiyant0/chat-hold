-- Update CustomerJourney table to use the correct journey stages and add indexes for performance

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customerjourney_created_at ON "CustomerJourney"(created_at);
CREATE INDEX IF NOT EXISTS idx_customerjourney_phone_number ON "CustomerJourney"(phone_number);
CREATE INDEX IF NOT EXISTS idx_customerjourney_follow_up ON "CustomerJourney"(follow_up);
CREATE INDEX IF NOT EXISTS idx_user_updated_at ON "User"(updated_at);
CREATE INDEX IF NOT EXISTS idx_keluhan_datetime ON "Keluhan"("Datetime");
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "Order"(created_at);
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

-- Update the get_daily_customer_journey_metrics function to accept date parameter
CREATE OR REPLACE FUNCTION get_daily_customer_journey_metrics(target_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "CustomerJourney"
  WHERE DATE(created_at) = target_date;
$$;

-- Create function to get customer journey metrics with date range
CREATE OR REPLACE FUNCTION get_customer_journey_metrics_range(start_date date, end_date date)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "CustomerJourney"
  WHERE DATE(created_at) BETWEEN start_date AND end_date;
$$;

-- Create function to get chat metrics with date range
CREATE OR REPLACE FUNCTION get_chat_metrics_range(start_date date, end_date date)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT phone_number)::integer
  FROM "User"
  WHERE DATE(updated_at) BETWEEN start_date AND end_date;
$$;

-- Create function to get complaints metrics with date range
CREATE OR REPLACE FUNCTION get_complaints_metrics_range(start_date date, end_date date)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "Keluhan"
  WHERE DATE("Datetime") BETWEEN start_date AND end_date;
$$;

-- Create function to get checkout metrics with date range
CREATE OR REPLACE FUNCTION get_checkout_metrics_range(start_date date, end_date date)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "Order"
  WHERE status = 'PROCESSING' AND DATE(created_at) BETWEEN start_date AND end_date;
$$;