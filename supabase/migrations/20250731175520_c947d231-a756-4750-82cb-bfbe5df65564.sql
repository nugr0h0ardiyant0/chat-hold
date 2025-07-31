-- Create the missing update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create pembelian table combining Order and Cart data
CREATE TABLE public.pembelian (
  id TEXT NOT NULL PRIMARY KEY,
  nama_penerima TEXT,
  no_hp_penerima TEXT,
  alamat_penerima TEXT,
  ringkasan TEXT,
  total_pembayaran NUMERIC,
  proses BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pembelian table
ALTER TABLE public.pembelian ENABLE ROW LEVEL SECURITY;

-- Create policies for pembelian table
CREATE POLICY "Authenticated users can view pembelian" 
ON public.pembelian 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage pembelian based on role" 
ON public.pembelian 
FOR ALL 
USING (auth.uid() IN ( SELECT users.id
   FROM users
  WHERE ((users.role)::text = ANY ((ARRAY['admin'::character varying, 'operator'::character varying])::text[]))));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pembelian_updated_at
BEFORE UPDATE ON public.pembelian
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();