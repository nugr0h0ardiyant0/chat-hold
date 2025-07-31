-- Enable RLS for tables that don't have it
ALTER TABLE public."Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CustomerJourney" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Keluhan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Pembayaran" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."n8n_chat_histories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."n8n_chat_histories_cozmed" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."temp_message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."user_follow_up" ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for tables without them
CREATE POLICY "Authenticated users can view Cart" ON public."Cart" FOR SELECT USING (true);
CREATE POLICY "Users can manage Cart based on role" ON public."Cart" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view CartItem" ON public."CartItem" FOR SELECT USING (true);
CREATE POLICY "Users can manage CartItem based on role" ON public."CartItem" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view CustomerJourney" ON public."CustomerJourney" FOR SELECT USING (true);
CREATE POLICY "Users can manage CustomerJourney based on role" ON public."CustomerJourney" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view Keluhan" ON public."Keluhan" FOR SELECT USING (true);
CREATE POLICY "Users can manage Keluhan based on role" ON public."Keluhan" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view Order" ON public."Order" FOR SELECT USING (true);
CREATE POLICY "Users can manage Order based on role" ON public."Order" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view Pembayaran" ON public."Pembayaran" FOR SELECT USING (true);
CREATE POLICY "Users can manage Pembayaran based on role" ON public."Pembayaran" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view documents" ON public."documents" FOR SELECT USING (true);
CREATE POLICY "Users can manage documents based on role" ON public."documents" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view temp_message" ON public."temp_message" FOR SELECT USING (true);
CREATE POLICY "Users can manage temp_message based on role" ON public."temp_message" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

CREATE POLICY "Authenticated users can view user_follow_up" ON public."user_follow_up" FOR SELECT USING (true);
CREATE POLICY "Users can manage user_follow_up based on role" ON public."user_follow_up" FOR ALL USING (auth.uid() IN (SELECT users.id FROM users WHERE (users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[])));

-- Add policies for n8n tables - these can be more open for external access
CREATE POLICY "Allow all operations on n8n_chat_histories" ON public."n8n_chat_histories" FOR ALL USING (true);
CREATE POLICY "Allow all operations on n8n_chat_histories_cozmed" ON public."n8n_chat_histories_cozmed" FOR ALL USING (true);