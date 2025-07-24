-- Enable extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set up cron job to store daily metrics every day at midnight
SELECT cron.schedule(
  'store-daily-metrics',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT
    net.http_post(
        url:='https://abwtufgltoxcwatykksm.supabase.co/functions/v1/store-daily-metrics',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3R1ZmdsdG94Y3dhdHlra3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDU2NDksImV4cCI6MjA2NzYyMTY0OX0.ar9FtoofpXD9qfHBXlKJcF0IIF1wzvVXnEMNjKaqJEM"}'::jsonb,
        body:=concat('{"date": "', CURRENT_DATE, '"}')::jsonb
    ) as request_id;
  $$
);

-- Enable RLS for DailyMetrics table and create policies
ALTER TABLE "DailyMetrics" ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read daily metrics
CREATE POLICY "Authenticated users can view daily metrics" 
ON "DailyMetrics" 
FOR SELECT 
USING (true);

-- Only admins can insert/update daily metrics
CREATE POLICY "Service role can manage daily metrics" 
ON "DailyMetrics" 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (
  SELECT id FROM users WHERE role = 'admin'
));