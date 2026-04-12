-- ============================================================
-- HERBS PRODUCT SHOWCASE - COMPLETE DATABASE SETUP
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- 1. Drop existing tables if they exist (fresh start)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- 2. Create products table (with pack_size column)
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  description text,
  pack_size text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 3. Create site settings table (single row)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_name_en text DEFAULT 'Herbs Showcase',
  site_name_bn text DEFAULT 'হার্বস শোকেস',
  theme text DEFAULT 'dark',
  currency_symbol text DEFAULT '৳',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 4. Disable RLS for simplicity
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- 5. Insert default site settings
INSERT INTO public.site_settings (id, site_name_en, site_name_bn, theme, currency_symbol)
VALUES (1, 'Herbs Showcase', 'হার্বস শোকেস', 'dark', '৳');

-- 6. Insert all products
-- ===== IMAGE 1: Products 01-11 =====

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Reishi Mushroom Powder', 800.00,
 'Premium reishi mushroom powder. Supports immune function, cardiovascular health, stress relief, and overall vitality. Rich in antioxidants and beta-glucans.',
 '200gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Oyster Mushroom Powder', 250.00,
 'Nutrient-dense oyster mushroom powder. Boosts immunity, supports cholesterol management, and provides essential amino acids, vitamins, and minerals.',
 '200gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Shiitake Mushroom Powder', 500.00,
 'High-quality shiitake mushroom powder. Enhances immune defense, supports liver function, and promotes healthy skin. Contains lentinan and eritadenine.',
 '200gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Trio', 500.00,
 'A powerful blend of three premium mushroom varieties. Combines the benefits of reishi, shiitake, and oyster mushrooms for comprehensive wellness support.',
 '100gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Shiitake Plus Powder', 680.00,
 'Enhanced shiitake formula with additional herbal extracts. Supports digestive health, boosts energy, and strengthens the immune system.',
 '300gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Uriflow', 80.00,
 'Herbal supplement for urinary tract health. Supports kidney function and promotes healthy urinary flow using natural ganoderma extracts.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Soya', 430.00,
 'Mushroom-enriched soy protein blend. Provides complete plant-based nutrition with the added benefits of medicinal mushroom compounds.',
 '200gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Cleanser', 280.00,
 'Internal body cleanser formulated with medicinal mushrooms. Supports detoxification, digestive cleansing, and promotes gut health.',
 '100gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Moringa Powder', 470.00,
 'Powerful combination of medicinal mushrooms and moringa leaf. Rich in iron, calcium, vitamins, and antioxidants for overall nutrition.',
 '130gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('HERBS Cordyceps Militaris', 1300.00,
 'Premium cordyceps militaris extract. Enhances athletic performance, supports respiratory health, boosts energy, and promotes anti-aging benefits.',
 '15gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Oyster Mushroom Dry', 680.00,
 'Dried whole oyster mushrooms. Ready to cook, rich in protein, fiber, and essential nutrients. Perfect for soups, curries, and stir-fries.',
 '400gm');

-- ===== IMAGE 2: Products 12-19 =====

INSERT INTO public.products (name, price, description, pack_size) VALUES
('GanoTonic Herbs', 1800.00,
 'Premium ganoderma tonic drink. A comprehensive herbal formulation combining multiple beneficial herbs for vitality, immunity, and overall wellness.',
 '15 sachets');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Gano Sliming Herbs', 750.00,
 'Natural weight management herbal tea. Supports metabolism, fat burning, and healthy weight loss through a blend of ganoderma and slimming herbs.',
 '15 sachets');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Cap', 450.00,
 'Ganoderma lucidum capsules for daily wellness. Supports immune function, liver health, and provides powerful antioxidant protection.',
 '60 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Oyster Mushroom Capsule', 820.00,
 'Convenient oyster mushroom extract in capsule form. Supports cardiovascular health, immunity, and provides essential nutrients.',
 '60 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Noni', 500.00,
 'Ganoderma and noni fruit combination capsules. Supports joint health, inflammation reduction, and boosts overall immune response.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Fresh', 440.00,
 'Refreshing ganoderma supplement for daily vitality. Supports mental clarity, energy levels, and promotes a healthy immune system.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Hepatec', 500.00,
 'Liver support formula with ganoderma extract. Promotes liver detoxification, supports healthy liver function, and protects against oxidative stress.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Slim', 550.00,
 'Weight management capsules with ganoderma. Supports healthy metabolism, appetite control, and natural fat metabolism.',
 '30 caps');

-- ===== IMAGE 3: Products 20-32 =====

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Methi', 430.00,
 'Mushroom and fenugreek combination for blood sugar management. Supports healthy glucose levels and digestive health.',
 '70 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Reishi Tongkat Ali', 1200.00,
 'Premium blend of reishi mushroom and tongkat ali. Supports hormonal balance, physical performance, and mental energy.',
 '15 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Gynura', 250.00,
 'Mushroom and gynura leaf extract. Supports healthy blood pressure, cholesterol management, and natural detoxification.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Ganocid', 480.00,
 'Ganoderma-based supplement for gastric health. Supports stomach lining protection, reduces acidity, and promotes digestive comfort.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Ginseng', 840.00,
 'Powerful combination of ganoderma and ginseng. Enhances physical stamina, mental focus, and supports stress adaptation.',
 '10 sachets');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Charcoal', 600.00,
 'Activated charcoal with ganoderma extract. Supports digestive detox, reduces bloating, and promotes intestinal health.',
 '50 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Ganokuma', 480.00,
 'Ganoderma and turmeric blend for anti-inflammatory support. Promotes joint health, reduces inflammation, and supports immunity.',
 '30 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano GT Special', 1200.00,
 'Special edition ganoderma tea blend. Premium formulation for enhanced vitality, immune support, and overall wellness.',
 '25 sachets');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Mycelium', 600.00,
 'Pure ganoderma mycelium capsules. Rich in polysaccharides and triterpenes for deep immune system support.',
 '60 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Moringa Cap', 500.00,
 'Moringa and mushroom extract capsules. Packed with vitamins, minerals, and antioxidants for daily nutritional support.',
 '60 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Spiruvil-C', 290.00,
 'Spirulina with vitamin C supplement. Supports immune function, provides essential nutrients, and boosts energy naturally.',
 '50 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Spirulina-H', 420.00,
 'Premium spirulina capsules. Rich in protein, B vitamins, iron, and antioxidants. Supports nutrition and detoxification.',
 '82 caps');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Extract', 810.00,
 'Concentrated liquid mushroom extract. Easy-to-consume format delivering the full spectrum of mushroom health benefits.',
 '350ml');

-- ===== IMAGE 4: Products 33-44 =====

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs GL Tonic', 1000.00,
 'Ganoderma lucidum health tonic. Liquid herbal formulation for liver support, immunity, and overall vitality.',
 '850ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Bar', 310.00,
 'Nutritious mushroom-enriched soap bar. Natural cleansing with mushroom extracts for healthy, glowing skin.',
 '75gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Hair Oil', 850.00,
 'Herbal hair oil enriched with mushroom extracts. Promotes hair growth, reduces hair fall, and nourishes the scalp.',
 '200ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Glow Cream', 350.00,
 'Ganoderma-infused skin cream. Moisturizes, brightens, and protects skin with natural antioxidants and herbal extracts.',
 '30gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Ganode Shampoo', 810.00,
 'Premium herbal shampoo with ganoderma extract. Cleanses, nourishes, and strengthens hair from root to tip.',
 '200ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Gano G Oil', 500.00,
 'Multipurpose ganoderma essential oil. Soothes muscles, supports skin health, and provides aromatic relaxation benefits.',
 '8ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Genital', 500.00,
 'Herbal ointment for intimate care. Natural mushroom-based formulation for gentle, effective personal hygiene.',
 '30gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano Neem Oil', 340.00,
 'Neem oil enhanced with ganoderma extract. Natural antiseptic for skin issues, insect bites, and general skin health.',
 '30ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Mushroom Karanja Oil', 200.00,
 'Karanja seed oil with mushroom extracts. Natural remedy for skin conditions, wound healing, and anti-microbial support.',
 '8ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Gano D Care', 920.00,
 'Dental and oral care solution with ganoderma. Supports gum health, fresh breath, and natural oral hygiene.',
 '50ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Gano Ear Clean', 200.00,
 'Natural ear cleaning solution with herbal extracts. Safe and gentle formula for ear hygiene and maintenance.',
 '8ml');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Ganogesic', 430.00,
 'Herbal pain relief balm with ganoderma. Soothes muscle aches, joint pain, and provides warming therapeutic relief.',
 '40gm');

INSERT INTO public.products (name, price, description, pack_size) VALUES
('Herbs Honey', 240.00,
 'Pure natural honey enriched with herbal extracts. Raw, unprocessed honey for immunity, energy, and daily wellness.',
 '175gm');

-- 7. Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-imgs', 'product-imgs', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage access policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-imgs');
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-imgs');
CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'product-imgs');
