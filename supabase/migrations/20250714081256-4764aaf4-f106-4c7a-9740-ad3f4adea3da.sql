-- Update existing users table to match requirements
ALTER TABLE public.users 
DROP COLUMN IF EXISTS password,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ALTER COLUMN role SET DEFAULT 'operator',
DROP CONSTRAINT IF EXISTS users_role_check,
ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'operator'));

-- Update existing Produk table to match requirements  
ALTER TABLE public."Produk"
ADD COLUMN IF NOT EXISTS product_id SERIAL,
ALTER COLUMN nama SET NOT NULL;

-- Update existing Promo table to match requirements
ALTER TABLE public."Promo"
ADD COLUMN IF NOT EXISTS judul_promo TEXT;

-- Enable RLS on all tables for proper access control
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Produk" ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public."Promo" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (id = auth.uid() OR auth.uid() IN (
  SELECT id FROM public.users WHERE role = 'admin'
));

CREATE POLICY "Only admins can manage users"
ON public.users
FOR ALL
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role = 'admin'
));

-- Create RLS policies for Produk table
CREATE POLICY "Authenticated users can view products"
ON public."Produk"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage products based on role"
ON public."Produk"
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'operator')
));

-- Create RLS policies for Promo table  
CREATE POLICY "Authenticated users can view promos"
ON public."Promo"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage promos based on role"
ON public."Promo"
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'operator')
));

-- Re-enable RLS on User table with proper policies for admin access
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all User records"
ON public."User"
FOR ALL
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role = 'admin'
));

CREATE POLICY "Users can view User records"
ON public."User"
FOR SELECT
TO authenticated  
USING (true);

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;