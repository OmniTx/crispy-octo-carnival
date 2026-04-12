-- 1. Create the products table
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 2. Disable Row Level Security (RLS) as requested for simplicity
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 3. Create the 'product-imgs' storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-imgs', 'product-imgs', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies so anyone can read/write to the bucket (for simplicity, usually you'd lock down uploads)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-imgs');
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-imgs');
CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'product-imgs');
