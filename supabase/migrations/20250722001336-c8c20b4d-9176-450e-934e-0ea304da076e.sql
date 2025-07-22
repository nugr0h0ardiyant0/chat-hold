-- Create function to get customer journeys with proper return type
CREATE OR REPLACE FUNCTION get_customer_journeys()
RETURNS TABLE (
  id bigint,
  phone_number text,
  customer_journey text,
  follow_up boolean,
  message text,
  message_id text,
  session text,
  created_at timestamp with time zone,
  updated_at timestamp without time zone
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    phone_number,
    customer_journey,
    follow_up,
    message,
    message_id,
    session,
    created_at,
    updated_at
  FROM "CustomerJourney"
  ORDER BY created_at DESC;
$$;

-- Create function to update customer journey follow up
CREATE OR REPLACE FUNCTION update_customer_journey_followup(journey_id bigint, new_follow_up boolean)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE "CustomerJourney" 
  SET follow_up = new_follow_up, updated_at = now()
  WHERE id = journey_id;
$$;

-- Create function to create customer journey
CREATE OR REPLACE FUNCTION create_customer_journey(
  p_phone_number text,
  p_customer_journey text,
  p_follow_up boolean,
  p_message text,
  p_message_id text,
  p_session text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO "CustomerJourney" (
    phone_number,
    customer_journey,
    follow_up,
    message,
    message_id,
    session
  ) VALUES (
    p_phone_number,
    p_customer_journey,
    p_follow_up,
    p_message,
    p_message_id,
    p_session
  );
$$;

-- Create function to update customer journey
CREATE OR REPLACE FUNCTION update_customer_journey(
  journey_id bigint,
  p_phone_number text,
  p_customer_journey text,
  p_follow_up boolean,
  p_message text,
  p_message_id text,
  p_session text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE "CustomerJourney" 
  SET 
    phone_number = p_phone_number,
    customer_journey = p_customer_journey,
    follow_up = p_follow_up,
    message = p_message,
    message_id = p_message_id,
    session = p_session,
    updated_at = now()
  WHERE id = journey_id;
$$;

-- Update the existing get_daily_customer_journey_metrics function
CREATE OR REPLACE FUNCTION get_daily_customer_journey_metrics()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "CustomerJourney"
  WHERE DATE(created_at) = CURRENT_DATE;
$$;

-- Update the existing get_follow_up_count function  
CREATE OR REPLACE FUNCTION get_follow_up_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM "CustomerJourney"
  WHERE follow_up = true;
$$;