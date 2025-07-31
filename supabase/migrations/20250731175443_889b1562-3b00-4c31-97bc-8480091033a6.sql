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

-- Function to create pembelian record from order and cart data
CREATE OR REPLACE FUNCTION public.create_pembelian_from_order(order_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  order_record RECORD;
  cart_record RECORD;
BEGIN
  -- Get order data
  SELECT * INTO order_record FROM "Order" WHERE id = order_id;
  
  -- Get cart data (assuming cart_id matches order_id or phone number)
  SELECT * INTO cart_record 
  FROM "Cart" 
  WHERE id = order_id OR phone_number = order_record.no_hp_penerima
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Insert into pembelian table
  INSERT INTO public.pembelian (
    id,
    nama_penerima,
    no_hp_penerima,
    alamat_penerima,
    ringkasan,
    total_pembayaran,
    created_at,
    updated_at
  ) VALUES (
    order_record.id,
    order_record.nama_penerima,
    order_record.no_hp_penerima,
    order_record.alamat_penerima,
    COALESCE(cart_record.ringkasan, 'Tidak ada ringkasan'),
    COALESCE(cart_record.total_pembayaran, 0),
    order_record.created_at,
    order_record.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    nama_penerima = EXCLUDED.nama_penerima,
    no_hp_penerima = EXCLUDED.no_hp_penerima,
    alamat_penerima = EXCLUDED.alamat_penerima,
    ringkasan = EXCLUDED.ringkasan,
    total_pembayaran = EXCLUDED.total_pembayaran,
    updated_at = now();
END;
$$;