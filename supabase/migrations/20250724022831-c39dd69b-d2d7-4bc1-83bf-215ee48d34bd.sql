-- Create function to get customer journey metrics grouped by stage and date range
CREATE OR REPLACE FUNCTION get_customer_journey_stage_metrics(start_date date, end_date date)
RETURNS TABLE(
  customer_journey text,
  count bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    customer_journey,
    COUNT(*) as count
  FROM "CustomerJourney"
  WHERE DATE(created_at) BETWEEN start_date AND end_date
  GROUP BY customer_journey
  ORDER BY customer_journey;
$$;