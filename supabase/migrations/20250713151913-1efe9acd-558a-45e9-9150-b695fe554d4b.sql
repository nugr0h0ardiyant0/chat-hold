-- Disable RLS on User table for admin operations
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;

-- Or alternatively, if you want to keep RLS enabled, create policies that allow all operations:
-- Note: Uncomment the lines below if you prefer to keep RLS enabled with permissive policies

-- ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow all operations on User table" 
-- ON public."User" 
-- FOR ALL 
-- USING (true) 
-- WITH CHECK (true);