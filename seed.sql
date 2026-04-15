-- ============================================================
-- HERBS PRODUCT SHOWCASE - COMPLETE DATABASE SETUP
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- 1. Drop existing tables if they exist (fresh start)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- 2. Create products table
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  name_bn text,
  price numeric(10,2) NOT NULL,
  description text,
  description_bn text,
  usage_info text,
  usage_info_bn text,
  pack_size text,
  pack_size_bn text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  sort_order integer DEFAULT 0
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

-- 4. Enable RLS and set policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Products
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Policies for Site Settings
CREATE POLICY "Allow public read access" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 7. Insert default site settings
INSERT INTO public.site_settings (id, site_name_en, site_name_bn, theme, currency_symbol)
VALUES (1, 'Herbs Showcase', 'হার্বস শোকেস', 'light', '৳')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert all products (WITH EXACT BANGLA TRANSLATIONS FROM CATALOG)
-- ===== Products 01-11 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Reishi Mushroom Powder', 'হার্বস রিশি মাশরুম পাউডার', 400.00,
 'Premium reishi mushroom powder. Supports immune function, cardiovascular health, stress relief, and overall vitality.',
 'দেহের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে, দেহের টক্সিন দূর করে ও বার্ধক্য প্রতিরোধ করে। টিউমার, ক্যান্সার, ডায়াবেটিস, উচ্চ রক্তচাপ, রক্তের অতিরিক্ত কোলেস্টেরল ও ট্রাইগ্লিসারাইড এর মাত্রা কমাতে, হেপাটাইটিস, বাতব্যথা, এলার্জি, ব্রঙ্কিয়াল এ্যাজমা, ইনফুয়েঞ্জা ও ব্রংকাইটিসে কার্যকরী।',
 '2-3 tsp powder in 2 glasses of water at night, simmer to 1 glass in morning. Or 2-3 tsp in 1 glass hot water for 20 mins, drink on empty stomach with lemon juice.',
 '২-৩ চা চামচ পাউডার ২ গ্লাস (৪০০ মি.লি.) পানিতে রাতে ভিজিয়ে সকালে মৃদু আঁচে ১ গ্লাস পরিমাণ থাকতে নামিয়ে বা ২-৩ চা চামচ পাউডার ১ গ্লাস গরম পানিতে ২০ মিনিট ভিজিয়ে ১ টুকরো লেবুর রস মিশিয়ে খালি পেটে সেব্য।', '50gm', '৫০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Oyster Mushroom Powder', 'হার্বস ওয়েস্টার মাশরুম পাউডার', 270.00,
 'Nutrient-dense oyster mushroom powder. Boosts immunity, supports cholesterol management.',
 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে, অপুষ্টি ও রক্তস্বল্পতা দূর করতে, ডায়াবেটিস প্রতিরোধ ও চিকিৎসায়, আমাশয়, বাতব্যথা, কোষ্ঠকাঠিন্য, গ্যাস্ট্রিক ও গ্যাসের সমস্যা দূর করতে, মেদ কমাতে, শিশু ও গর্ভবতী মহিলাদের পুষ্টি সাধনে, দাঁত ও হাড়ের গঠনে, চুল পাকা ও চুল পড়া রোধে কার্যকরী।',
 '1 tsp powder mixed with hot water, milk, tea, coffee, soup, or food 2-3 times daily.',
 '১ চা চামচ পাউডার গরম পানি, দুধ, চা, কফি, স্যুপ, বা যেকোন খাবারের সাথে মিশিয়ে দিনে ২-৩ বার সেব্য।', '50gm', '৫০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Shiitake Mushroom Powder', 'হার্বস শিতাকে মাশরুম পাউডার', 500.00,
 'High-quality shiitake mushroom powder. Enhances immune defense and supports liver function.',
 'রোগ প্রতিরোধ ক্ষমতা বাড়ায়, হৃদরোগ, কোলেস্টেরল, উচ্চ রক্তচাপ, ক্যান্সার, টিউমার প্রতিরোধে এবং শারীরিক দুর্বলতায় কার্যকরী।',
 '1 tsp powder mixed with hot water, milk, tea, coffee, soup, or food 2-3 times daily.',
 '১ চা চামচ পাউডার গরম পানি, দুধ, চা, কফি, স্যুপ বা যেকোন খাবারের সাথে মিশিয়ে দিনে ২-৩ বার সেব্য।', '50gm', '৫০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Trio', 'হার্বস মাশরুম ট্রায়ো', 600.00,
 'A powerful blend of three premium mushroom varieties for comprehensive wellness.',
 'কফনাশক, মনে প্রফুল্লতা আনয়ন কারক, পরিপাকতন্ত্র সুস্থ রাখে, ব্লাড সুগার রোধে ও পুরুষ হরমোন ব্যালেন্স করে যৌন জীবনকে আনন্দময় করে।',
 '1 tsp powder with a cup of hot water/milk daily after meals.',
 '১ চা চামচ পাউডার দিনে এক বার এক কাপ গরম পানি/দুধ এর সাথে মিশিয়ে আহারের পর সেব্য।', '100gm', '১০০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Shiitake Plus Powder', 'হার্বস শিতাকে প্লাস পাউডার', 620.00,
 'Enhanced shiitake formula with additional herbal extracts for digestive and immune health.',
 'বলবর্ধক, শুক্রতারল্য দূর করতে ও দুর্বল শুক্রাণুকে শক্তিশালী করে সন্তান উৎপাদনে সহায়তা করে।',
 '1 tsp with 1 cup warm milk or water 1-2 times daily.',
 '১ চা চামচ ১ কাপ কুসুম গরম দুধ বা পানির সাথে মিশিয়ে দিনে ১-২ বার সেব্য।', '80gm', '৮০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Uriflow', 'হার্বস গ্যানো ইউরিফ্লো', 40.00,
 'Herbal supplement for urinary tract health using natural ganoderma extracts.',
 'ব্যথানাশক ও প্রদাহনাশক। হাত-পা জ্বালাপোড়া, সর্বশরীরের ব্যথা ও জ্বালা নিবারক। মূত্রবর্ধক, প্রোষ্টেট প্রদাহ, কিডনী ও লিভার সুরক্ষায় কার্যকরী। প্রস্রাবনাশক ও রক্ত শোধক।',
 'Soak 1 sachet in 1 glass of hot water in the morning, strain and drink at night after meals. Soak 1 sachet at night, strain and drink in the morning after meals.',
 'সকালে ১ টি স্যাচেট ১ গ্লাস গরম পানিতে ভিজিয়ে রেখে রাতে ছেঁকে আহারের পর সেব্য ও রাতে ১ টি স্যাচেট ভিজিয়ে সকালে আহারের পর ছেঁকে সেব্য।', '10gm', '১০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Soya', 'হার্বস মাশরুম সয়া', 730.00,
 'Mushroom-enriched soy protein blend for complete plant-based nutrition.',
 'খাদ্য পরিপূরক হিসেবে ডায়াবেটিস ও ওজন কমাতে, দেহের পুষ্টি সাধনে, শিশুদের বৃদ্ধি ও বিকাশে কার্যকরী।',
 '3 tsp mixed with 1 glass hot water/milk morning and night.',
 '৩ চা চামচ ১ গ্লাস গরম পানি/দুধের সাথে মিশিয়ে সকালে ও রাতে সেব্য।', '300gm', '৩০০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Cleanser', 'হার্বস মাশরুম ক্লিনজার', 240.00,
 'Internal body cleanser for detoxification, digestive cleansing, and gut health.',
 'কোষ্ঠকাঠিন্য ও গ্যাস্ট্রিক দূর করতে, এলার্জি ও শ্বাসকষ্ট কমাতে, শ্বাসতন্ত্র পরিষ্কারক ও দেহকে টক্সিন মুক্ত করতে কার্যকরী।',
 'Half tsp mixed with 1 glass warm water 2 times daily after meals.',
 'হাফ চা চামচ ১ গ্লাস কুসুম গরম পানিতে মিশিয়ে দিনে ২ বার আহারের পর সেব্য।', '100gm', '১০০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Moringa Powder', 'হার্বস মাশরুম মরিঙ্গা পাউডার', 750.00,
 'Powerful combination of medicinal mushrooms and moringa leaf, rich in antioxidants.',
 'মরিঙ্গা শরীরের প্রতিরোধক ব্যবস্থা শক্তিশালী করে, শরীরের ব্যথা-বেদনা উপশমে, হৃদরোগ ও উচ্চ রক্তচাপ নিয়ন্ত্রণে, কোষ্ঠকাঠিন্য ও রক্তস্বল্পতা দূর করতে উপকারী।',
 '1 tsp mixed with 1 cup hot water 2 times daily before meals.',
 '১ চামচ করে দিনে ২ বার ১ কাপ গরম পানিতে মিশিয়ে আহারের পূর্বে সেব্য।', '150gm', '১৫০গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('HERBS Cordyceps Militaris', 'হার্বস কর্ডিসেপস মিলিটারিস', 7500.00,
 'Premium cordyceps militaris extract. Enhances athletic performance and anti-aging.',
 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে, কোলেস্টেরল কমাতে, কিডনী রোগে ও লিভার সিরোসিস এর মাত্রা কমাতে, ফুসফুস এবং লিভারকে শক্তিশালী করতে, টেস্টোস্টেরন নিঃসরণ এবং যৌনশক্তি বৃদ্ধি করতে, মস্তিষ্কের কর্মক্ষমতা বৃদ্ধি করতে, এন্টিটিউমার এবং এন্টিঅক্সিডেন্ট হিসেবে, ক্রীড়াবিদ এবং বয়স্ক ব্যক্তিদের স্বাস্থ্যের উন্নতি করতে কার্যকরী।',
 'Soak 1 gram in 1 cup hot water for 20 mins, chew the cordyceps and drink the water on empty stomach in morning.',
 'এক গ্রাম কর্ডিসেপস এক কাপ গরম পানিতে ২০ মিনিট ভিজিয়ে রাখুন, সকালে খালি পেটে পানিসহ কর্ডিসেপস চিবিয়ে খান।', '15gm', '১৫গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Oyster Mushroom Dry', 'হার্বস ওয়েস্টার মাশরুম ড্রাই', 340.00,
 'Dried whole oyster mushrooms. Ready to cook, rich in protein and fiber.',
 'সুস্বাদু ও পুষ্টিকর ওয়েস্টার মাশরুম রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে, অপুষ্টি ও রক্তস্বল্পতা দূর করতে, দেহের পুষ্টি সাধনে, দাঁত ও হাড়ের গঠনে কার্যকরী।',
 'Cook 10 grams per person daily with fish, meat, vegetables, soup, or noodles. Soak in warm water for 5-10 mins before cooking.',
 'মাছ, মাংস, সবজি, স্যুপ, নুডুলস সহ বিভিন্ন খাবারের সাথে প্রতিদিন জন প্রতি ১০ গ্রাম মাত্রায় রান্না করে খেতে হবে। রান্নার পূর্বে ৫-১০ মিনিট কুসুম গরম পানিতে ভিজিয়ে রাখতে হবে।', '80gm', '৮০গ্রাম');

-- ===== Products 12-19 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('GanoTonic Herbs', 'গ্যানো টনিক হার্বস', 1800.00,
 'Premium ganoderma tonic drink for vitality, immunity, and overall wellness.',
 'এই মাশরুমের প্রধান কাজ দেহকে টক্সিন মুক্ত করা। রক্ত ও রক্তনালীকে টক্সিন মুক্ত করে রক্তের অতিরিক্ত কোলেস্টেরল ও ট্রাইগ্লিসারাইড এর মাত্রা কমিয়ে দেহের স্বাভাবিক ও স্বতঃস্ফূর্ত অক্সিজেন সমৃদ্ধ রক্তপ্রবাহ নিশ্চিত করে সেই সাথে দেহের গুরুত্বপূর্ণ অঙ্গসমূহ ব্রেন, হার্ট, কিডনী, লিভার, ফুসফুস, অগ্ন্যাশয়ের কার্যক্ষমতা বৃদ্ধি করে, ফলে উচ্চ রক্তচাপ, মস্তিষ্কে রক্ত ক্ষরণ, ডায়াবেটিস, আর্থ্রাইটিস, টিউমার, ক্যান্সার, মেদ, হাঁপানি, এলার্জি, অনিদ্রা, স্মৃতিহ্রাস, স্নায়বিক রোগ, যৌনসমস্যাসহ নানাবিদ ডিজেনারেটিভ বা মেদঘটিত জনিত রোগ সমূহের প্রতিরোধ ও প্রতিকারে কার্যকরী ভূমিকা রাখে। ইহা ছাড়াও এই মাশরুমের রয়েছে ভাইরাস, ব্যাকটেরিয়া ও ফাঙ্গাস বিরোধী ক্রিয়া, ফলে ইহা নিউমোনিয়া, ব্রংকাইটিস, হেপাটাইটিস, এইডস, গ্যাষ্ট্রিক, সোরাইয়াসিসসহ নানাবিদ চর্মরোগ প্রতিরোধ ও প্রতিকারেও কার্যকরী ভূমিকা রাখে।',
 'Soak 1 sachet in 2 glasses of water at night, simmer to 1 glass in the morning, strain and drink warm with lemon juice on empty stomach. Can use another sachet in the evening if needed.',
 'একটি স্যাচেট রাতে ২ গ্লাস (৪০০ মিলি) পানিতে ভিজিয়ে সকালে মৃদু জালে ১ গ্লাস পরিমাণ থাকতে নামিয়ে ছেঁকে কুসুম গরম অবস্থায় এক টুকরো লেবুর রস মিশিয়ে খালি পেটে সেব্য। প্রয়োজনে আরেকটি স্যাচেট সকালে ভিজিয়ে একই নিয়মে সন্ধ্যায় সেব্য।', '15 Sachets', '১৫ স্যাচেট');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Gano Sliming Herbs', 'গ্যানো স্লিমিং হার্বস', 750.00,
 'Natural weight management herbal tea supporting metabolism and fat burning.',
 'মাশরুম একটি ফ্যাট মুক্ত ও ফাইবার সমৃদ্ধ খাবার যা দ্রুত শরীরের অতিরিক্ত মেদ কমিয়ে দেহকে স্লিম ও আকর্ষনীয় করতে কার্যকরী। সম্পূর্ণ প্রাকৃতিক উপাদানে তৈরী গ্যানো স্লিমং হার্বস শরীরের মেদ কমানোর সাথে সাথে রক্তের অতিরিক্ত কোলেস্টেরল ও ট্রাইগ্লিসারাইড এর মাত্রা কমাতেও কার্যকরী।',
 'Soak 1 sachet in 1 glass hot water for 20-30 mins, strain and drink before sleep. Can take another in the morning after breakfast if needed.',
 'একটি স্যাচেট এক গ্লাস গরম পানিতে ২০-৩০ মিনিট ভিজিয়ে ছেঁকে রাতে ঘুমানোর পূর্বে সেব্য। প্রয়োজনে আরেকটি স্যাচেট একই নিয়মে সকালে নাস্তার পর সেব্য।', '15 Sachets', '১৫ স্যাচেট');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Cap', 'হার্বস গ্যানো ক্যাপ', 660.00,
 'Ganoderma lucidum capsules for daily wellness and immune support.',
 'দেহের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে ও বার্ধক্য প্রতিরোধ করে। টিউমার, ডায়াবেটিস, উচ্চ রক্তচাপ, রক্তের অতিরিক্ত কোলেস্টেরল ও ট্রাইগ্লিসারাইড এর মাত্রা কমাতে, হেপাটাইটিস, বাতব্যথা, এলার্জি, ব্রঙ্কিয়াল এ্যাজমা, ইনফুয়েঞ্জা ও ব্রংকাইটিসে কার্যকরী।',
 '2 capsules 2-3 times daily before meals.',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '60 Caps', '৬০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Oyster Mushroom Capsule', 'হার্বস ওয়েস্টার মাশরুম ক্যাপসুল', 450.00,
 'Oyster mushroom extract in capsule form for cardiovascular health and immunity.',
 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে, অপুষ্টি ও রক্তস্বল্পতা দূর করতে, ডায়াবেটিস প্রতিরোধ ও চিকিৎসায়, আমাশয়, হৃদরোগ, কোলেস্টেরল, আর্থ্রাইটিস, ও গ্যাসের সমস্যা দূর করতে, মেদ কমাতে, শিশু ও গর্ভবতী মহিলাদের পুষ্টি সাধনে, দাঁত ও হাড়ের গঠনে, চুল পাকা ও চুল পড়া রোধে কার্যকরী।',
 '2 capsules 2-3 times daily before meals.',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '60 Caps', '৬০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Noni', 'হার্বস গ্যানো ননি', 660.00,
 'Ganoderma and noni fruit combination for joint health and inflammation reduction.',
 'টিউমার, ক্যান্সার প্রতিরোধ ও চিকিৎসায়, প্রদাহ ও ব্যথা নিবারণে কার্যকরী। ননিতে বিদ্যমান এন্টিব্যাকটেরিয়াল, এন্টিভাইরাল ও এন্টিফাঙ্গাল উপাদান দেহের সিফিলিস, গনেরিয়া, জরায়ুর ঘা/ইনফেকশন, টনসিল, অর্শ, আলসার, প্রস্রাবের জ্বালাপোড়া, ক্ষত নিরাময় এবং এলার্জিজনিত হাঁপানি রোগের জন্য কার্যকরী।',
 '1-2 capsules 2-3 times daily before meals.',
 '১-২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Fresh', 'হার্বস গ্যানো ফ্রেশ', 450.00,
 'Refreshing ganoderma supplement for daily vitality and mental clarity.',
 'স্নায়বিক দুর্বলতা ও বার্ধক্য প্রতিরোধে কার্যকরী। রক্ত পরিষ্কারক, জ্বর, বাত, রসবাতি, পক্ষাঘাত, স্নায়বিক দুর্বলতা, ঘন ঘন প্রস্রাব ও ডায়াবেটিস নিয়ন্ত্রণে কার্যকরী। অনিয়মিত ঋতুস্রাব, মেয়েদের দৈহিক চাহিদা বৃদ্ধি ও সন্তান উৎপাদনে ক্ষমতা বৃদ্ধি সহ মাদক বেদনা নিবারক, দৈহিক অনুভূতি বৃদ্ধিতে এবং অবসাদের শারীরিক ও মানসিক দুর্বলতা দূর করতে কার্যকরী।',
 '1 capsule 2 times daily after meals.',
 '১ টি করে ক্যাপসুল দিনে ২ বার আহারের পর সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Hepatec', 'হার্বস গ্যানো হেপাটেক', 600.00,
 'Liver support formula with ganoderma extract for liver detoxification.',
 'হেপাটাইটিস, লিভার প্রদাহ, জন্ডিস, ফ্যাটি লিভার, লিভার সিরোসিস ও এ্যালকোহল সেবনজনিত লিভার সমস্যায় কার্যকরী।',
 '1-2 capsules 2-3 times daily before meals.',
 '১-২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Slim', 'হার্বস গ্যানো স্লিম', 650.00,
 'Weight management capsules supporting healthy metabolism.',
 'শরীরের অতিরিক্ত মেদ কমাতে, রক্তের অতিরিক্ত কোলেস্টেরল ও ট্রাইগ্লিসারাইড এর মাত্রা কমাতে কার্যকরী।',
 '1 capsule 2-3 times daily before meals.',
 '১ টি ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপ');

-- ===== Products 20-32 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Methi', 'হার্বস মাশরুম মেথি', 490.00,
 'Mushroom and fenugreek for blood sugar management and digestive health.',
 'মেহ (প্রমেহ), স্বপ্নদোষ, প্রস্রাবের জ্বালাপোড়া, ডায়াবেটিস ও বাত-ব্যথা উপশমে কার্যকরী।',
 '2 capsules 2-3 times daily after meals.',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পরে সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Reishi Tongkat Ali', 'হার্বস রিশি টংকাট আলী', 1200.00,
 'Premium blend of reishi mushroom and tongkat ali for hormonal balance.',
 'শারীরিক ও মানসিক সজীবতা আনয়নে, যৌন অনুভূতি বৃদ্ধিতে, টেস্টোস্টেরন বৃদ্ধিতে, দ্রুত স্খলন রোধে ও যৌন দুর্বলতার চিকিৎসায় কার্যকরী।',
 '1 capsule 1 time daily after meals.',
 '১ টি ক্যাপসুল দিনে ১ বার আহারের পর সেব্য।', '15 Caps', '১৫ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Gynura', 'হার্বস মাশরুম গাইনুরা', 270.00,
 'Mushroom and gynura leaf extract for blood pressure and cholesterol management.',
 'ডায়াবেটিস চিকিৎসা ও প্রতিরোধের প্রাকৃতিক ইনসুলিন পরিপূরক। প্যানক্রিয়াসের বিটা সেলকে পুনরুজ্জীবিত করে ইনসুলিন নিঃসরণ কমাতে বাড়ায়।',
 '1-2 capsules 2-3 times daily before meals.',
 '১-২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Ganocid', 'হার্বস গ্যানোসিড', 240.00,
 'Ganoderma-based supplement for gastric health and digestive comfort.',
 'পেটফাঁপা, বুক জ্বালাপোড়া, বদহজম, চুকাঢেকুর, গ্যাস্ট্রিক আলসার, আমাশয় জনিত গ্যাস ও কোষ্ঠকাঠিন্য নিরাময়ে কার্যকরী।',
 '1-2 capsules 2-3 times daily before meals.',
 '১-২ টি করে ক্যাপসুল দিনে  ২-৩ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Ginseng', 'হার্বস গ্যানো জিনসেং', 450.00,
 'Powerful combination of ganoderma and ginseng for stamina and mental focus.',
 'সুপ্তযৌবন লাভে, পুরুষ হরমোন ও স্মৃতিশক্তি বৃদ্ধিতে, শারীরিক ও মানসিক সজীবতা আনয়নে ও যৌন অক্ষমতায় কার্যকরী।',
 '1 capsule every 2 days with warm water or milk at night after meals.',
 '১ টি করে ক্যাপসুল প্রতি ২ দিন পর পর কুসুম গরম পানি বা দুধের সাথে রাতে আহারের পর সেব্য।', '10 Caps', '১০ ক্যাপসুল');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Charcoal', 'হার্বস গ্যানো চারকোল', 600.00,
 'Activated charcoal with ganoderma for digestive detox and intestinal health.',
 'দেহকে এলার্জি বা বিষমুক্ত করতে, গ্যাস কমাতে, ক্যান্সার চিকিৎসায়, হার্টবার্ন নিবারণে, কিডনীর সুস্থতায় ও ক্রিয়েটিনিন কমাতে, দেহ টক্সিন মুক্ত করতে কার্যকরী।',
 '1-2 capsules 2 times daily after meals.',
 '১-২ টি ক্যাপসুল দিনে ২ বার আহারের পর সেব্য।', '60 Caps', '৬০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Ganokuma', 'হার্বস গ্যানোকুমা', 480.00,
 'Ganoderma and turmeric blend for anti-inflammatory support and immunity.',
 'এলার্জি ও চর্মরোগ দূর করতে, আর্থ্রাইটিস, বাত-ব্যথা, আঘাতজনিত ব্যথা ও প্রদাহ নিবারণে কার্যকরী ভূমিকা রাখে। রক্ত পরিষ্কারক হিসেবে এবং ত্বকের কোষগুলিতে অক্সিজেন সরবরাহ করে ত্বক সুস্থ রাখতে সহায়ক।',
 '1-2 capsules 1/2 times daily before meals.',
 '১-২ টি করে ক্যাপসুল প্রতিদিন ১/২ বার আহারের পূর্বে সেব্য।', '30 Caps/60 Caps', '৩০ ক্যাপ/৬০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano GT Special', 'হার্বস গ্যানো জিটি স্পেশাল', 1500.00,
 'Special edition ganoderma tea for enhanced vitality and immune support.',
 'দ্রুত বীর্যস্খলন রোধ করে ও দীর্ঘমেয়াদী যৌন দুর্বলতা নিবারণে কার্যকরী টনিক।',
 '1 capsule every 3 days at night after meals.',
 '১ টি করে ক্যাপসুল প্রতি ৩ দিন পর পর রাতে আহারের পর সেব্য।', '15 Caps', '১৫ ক্যাপসুল');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Mycelium', 'হার্বস গ্যানো মাইসেলিয়াম', 900.00,
 'Pure ganoderma mycelium capsules rich in polysaccharides for immune support.',
 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে, স্মৃতিশক্তি বৃদ্ধিতে, শিশুদের বৃদ্ধি ও বিকাশে, মানসিক প্রশান্তি আনয়নে উপকারী।',
 '1 capsule 2 times daily before meals.',
 '১ টি করে ক্যাপসুল দিনে ২ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপসুল');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Moringa Cap', 'হার্বস মাশরুম মরিঙ্গা ক্যাপ', 300.00,
 'Moringa and mushroom extract capsules packed with vitamins and antioxidants.',
 'মরিঙ্গা শরীরের প্রতিরোধক ব্যবস্থা শক্তিশালী করে, শরীরের ব্যথা-বেদনা উপশমে, হৃদরোগ ও উচ্চ রক্তচাপ নিয়ন্ত্রণে, কোষ্ঠকাঠিন্য ও রক্তস্বল্পতা দূর করতে উপকারী।',
 '2 capsules 2 times daily before meals.',
 '২ টি করে ক্যাপসুল দিনে ২ বার আহারের পূর্বে সেব্য।', '30 Caps', '৩০ ক্যাপসুল');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Spiruvil-C', 'স্পিরুভিট-সি', 270.00,
 'Spirulina with vitamin C supplement for immune function and energy.',
 'প্রাকৃতিক ভিটামিন সি। ভিটামিন সি এর অভাবজনিত রোগ ও ক্ষত নিরামণে কার্যকরী। মাড়ি ফোলা, দাঁত, মুখ ও গলার ক্ষত, আলসার, শিশুদের শারীরিক ও মানসিক বৃদ্ধিতে কার্যকরী।',
 'Minors: 1 capsule 1-2 times daily after meals. Adults: 1/2 capsules 2 times daily after meals.',
 'অপ্রাপ্তবয়স্ক- ১ টি করে ক্যাপসুল দিনে ১-২ বার আহারের পর সেব্য। প্রাপ্তবয়স্ক- ১/২ টি ক্যাপসুল দিনে ২ বার আহারের পর সেব্য।', '30 Caps', '৩০ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Spirulina-H', 'স্পিরুলিনা-এইচ', 450.00,
 'Premium spirulina capsules rich in protein, B vitamins, iron, and antioxidants.',
 'প্রোটিন, ভিটামিন ও মিনারেল সমৃদ্ধ পুষ্টির প্রাকৃতিক খনি যা শিশু, বয়স্ক ও গর্ভবতী মহিলাদের শারীরিক দুর্বলতা, ভিটামিন ও মিনারেলের চাহিদা মেটাতে এক মহা সুষম খাদ্য হিসেবে কার্যকরী। ডায়াবেটিস, উচ্চ রক্তচাপ, রক্তের কোলেস্টেরল নিয়ন্ত্রণে, ক্যান্সার ও টিউমার প্রতিরোধে ও মেদ কমাতে কার্যকরী।',
 'Minors: 1 capsule 1-2 times daily after meals. Adults: 2 capsules 2 times daily after meals. For weight loss: 3 capsules 2-3 times daily before meals.',
 'অপ্রাপ্তবয়স্ক- ১ টি করে ক্যাপসুল দিনে ১-২ বার আহারের পর সেব্য। প্রাপ্তবয়স্ক- ২ টি করে ক্যাপসুল দিনে ২ বার আহারের পর সেব্য। মেদ কমাতে- ৩ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেব্য।', '42 Caps', '৪২ ক্যাপ');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Extract', 'হার্বস মাশরুম এক্সট্রাক্ট', 480.00,
 'Concentrated liquid mushroom extract delivering full spectrum health benefits.',
 'শ্লেষ্মা নিবারক, মস্তিষ্ক পরিষ্কারক। পুরাতন মাথা ব্যথা, মাইগ্রেন, এ্যাজমা, নিউমোনিয়া, ব্রংকাইটিস, শ্লেষ্মা জনিত মাথাব্যথা, সাইনোসাইটিস, মানসিক দুর্বলতায় এবং শিশুদের শারীরিক ও মানসিক বৃদ্ধিতে কার্যকরী।',
 'Minors: 1-2 tsp 2 times daily after meals. Adults: 2-3 tsp 2 times daily after meals.',
 'অপ্রাপ্তবয়স্ক- ১-২ চা চামচ করে দিনে ২ বার আহারের পর সেব্য। প্রাপ্তবয়স্ক- ২-৩ চা চামচ করে দিনে ২ বার আহারের পর সেব্য।', '450 ml', '৪৫০ মিলি');

-- ===== Products 33-44 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs GL Tonic', 'হার্বস জিএল টনিক', 3500.00,
 'Ganoderma lucidum health tonic for liver support, immunity, and vitality.',
 'লিভার প্রবাহ, ফ্যাটি লিভার, হেপাটাইটিস, লিভার সিরোসিস, লিভার টিউমার ও ক্যান্সার, জন্ডিস ও কৃমিতে কার্যকরী। কিডনী ও ফুসফুস প্রদাহ জনিত শুষ্ক কাশিতে এবং দেহকে টক্সিন মুক্ত করে রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে কার্যকরী।',
 '2-3 tsp mixed in half cup hot water 2 times daily after meals.',
 '২-৩ চা চামচ হাফ কাপ গরম পানিতে মিশিয়ে দিনে ২ বার আহারের পর সেব্য।', '425 ml', '৪২৫ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Bar', 'হার্বস মাশরুম বার', 380.00,
 'Nutritious mushroom-enriched soap bar for healthy, glowing skin.',
 'মেছতা, ব্রন সহ মুখ ও ত্বকের অবাঞ্ছিত দাগ দূর করে। ত্বকের লাবণ্যতা বৃদ্ধি, চোখের নিচে কালো দাগ, গর্ভবতীদের পেটের দাগ দূর করে। এলার্জি ও চর্মরোগে বাহ্যিক ব্যবহারে কার্যকরী।',
 'Leave on face spots for 10-20 mins and wash 1-2 times daily. For allergies and skin diseases, use like normal bath soap on body.',
 'মেছতা, ব্রন সহ মুখের অবাঞ্ছিত দাগে ১০ থেকে ২০ মিনিট লাগিয়ে রেখে ধুয়ে ফেলুন দিনে ১-২ বার। এলার্জি এবং চর্ম রোগে গায়ে সাধারণ সাবানের মত ব্যবহার করতে হবে।', '75 gm', '৭৫ গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Hair Oil', 'হার্বস হেয়ার অয়েল', 450.00,
 'Herbal hair oil enriched with mushroom extracts for hair growth and scalp nourishment.',
 'অতিরিক্ত চুল পড়া রোধ করে, নতুন চুল গজাতে সহায়তা করে। চুল কালো ও লম্বা করে এবং খুসকি নিবারণ করে।',
 'Apply to hair roots with fingers 1 time daily.',
 'আঙ্গুল দিয়ে চুলের গোড়ায় দিনে ১ বার ব্যবহার করতে হবে।', '100 ml', '১০০ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Glow Cream', 'হার্বস গ্যানো গ্লো ক্রিম', 680.00,
 'Ganoderma-infused skin cream that moisturizes, brightens, and protects skin.',
 'হার্বস গ্যানো গ্লো একটি এন্টিএজিং, ময়েশ্চারাইজিং ক্রিম। এটি ত্বকের কালো দাগের জন্য দায়ী ডার্ক মেলানিন উৎপাদন কমিয়ে দেয় এবং মুখমন্ডলকে করে দাগহীন উজ্জ্বল ও ফর্সা।',
 'Apply gently all over face daily morning and night.',
 'আলতোভাবে সমস্ত মুখ মন্ডলে হার্বস গ্যানো গ্লো ক্রিম প্রতিদিন সকালে এবং রাতে ব্যবহার করতে হবে।', '30 gm', '৩০ গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Ganode Shampoo', 'হার্বস গ্যানোডি শ্যাম্পু', 780.00,
 'Premium herbal shampoo with ganoderma extract for strong, nourished hair.',
 'প্রাকৃতিক ফর্মুলায় তৈরি, খাঁটি মাশরুম নির্যাস সমৃদ্ধ। অতিরিক্ত চুল পড়া ও খুশকি নিয়ন্ত্রণে উপকারী।',
 'Wet hair well, apply shampoo and massage gently to lather, wash off after 5-7 mins.',
 'চুল ভালোভাবে ভেজানোর পর হার্বস গ্যানোডি শ্যাম্পু মাথায় অল্প অল্প করে লাগিয়ে আলতো ভাবে ম্যাসেজ করে ফেনা তৈরি করুন এবং পাঁচ-সাত মিনিট পর ধুয়ে ফেলুন।', '200 ml/110 ml', '২০০ মিলি/১১০ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Gano G Oil', 'গ্যানো জি অয়েল', 200.00,
 'Multipurpose ganoderma essential oil for muscle soothing and skin health.',
 'নিয়মিত ব্যবহারে পুরুষাঙ্গের ত্বকের পুষ্টি যোগায়, নিস্তেজ বক্রতা, গোড়া চিকন ও রগ ঢিলাভাব দ্রুত দূর করে।',
 'Massage 4-5 drops daily morning and night on organ from front to back for 2-3 mins.',
 '৪-৫ ফোটা করে প্রতিদিন সকালে ও রাতে পুরুষাঙ্গের সামনে থেকে পিছনের দিকে ২/৩ মিনিট মালিশ করুন।', '9 ml', '৯ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Genital', 'হার্বস মাশরুম জেনিটাল', 500.00,
 'Herbal ointment for intimate care with natural mushroom-based formulation.',
 'পুরুষাঙ্গকে সুদৃঢ় করে। পুরুষাঙ্গের শীথিলতা ও বক্রতা দূর করে। দ্রুত বীর্যপাত রোধ করে।',
 'Massage a small amount gently morning and night from front to back for 4-5 mins.',
 'প্রতিদিন সকালে ও রাতে সামান্য পরিমাণ লিঙ্গ আলতোভাবে পুরুষাঙ্গের সামনে থেকে পেছনের দিক ৪-৫ মিনিট মালিশ করতে হবে।', '30 gm', '৩০ গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano Neem Oil', 'হার্বস গ্যানো নিম অয়েল', 300.00,
 'Neem oil enhanced with ganoderma extract for skin issues and antiseptic care.',
 'দাদ, একজিমা, ব্রণ, চুলকানি, খুশকি, মাথার ত্বকের ফাঙ্গাস, ঘা/পচড়া, টনসিল পঁচা ঘা ও ক্ষত নিরাময়সহ সর্ব প্রকার চর্ম রোগে কার্যকরী।',
 'Apply small amount to affected area 1-2 times daily.',
 'আক্রান্ত স্থানে সামান্য পরিমাণ তেল দিনে ১-২ বার লাগাতে হবে।', '30 ml/10 ml', '৩০ মিলি/১০ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Mushroom Karanja Oil', 'হার্বস মাশরুম করঞ্জা অয়েল', 200.00,
 'Karanja seed oil with mushroom extracts for wound healing and skin conditions.',
 'নিয়মিত কয়েকদিন ব্যবহারে নাকের ভিতরে পলিপ বা মাংশপিন্ড ও মলদ্বারের অর্শ বা বলি চুপসে যাওয়ার সাথে মিশে যায়। এছাড়াও মাথা ব্যথা, সাইনোসাইটিস, কোল্ড এলার্জি ও নাক ডাকা রোগীদের জন্য কার্যকরী।',
 'Apply small amount to nasal polyps with cotton bud or to piles with cotton 1-2 times daily.',
 'নাকের পলিপে কটনবার দ্বারা ও অর্শের বলিতে তুলা দ্বারা সামান্য পরিমাণ তেল দিনে ১-২ বার লাগাতে হবে।', '9 ml', '৯ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Gano D Care', 'হার্বস গ্যানো ডি কেয়ার', 320.00,
 'Dental and oral care solution with ganoderma for gum health and fresh breath.',
 'খুশকি নিবারণে, মাথার ত্বকের ফাঙ্গাস ও প্রদাহ নিবারণে কার্যকরী। চুলের গোড়া শক্ত করে ও চুল পড়া রোধ করে।',
 'Apply to hair roots with fingers at night for 3-7 days.',
 '৩-৭ দিন রাতে চুলের গোড়ায় আঙ্গুল দিয়ে ব্যবহার করতে হবে।', '50 ml', '৫০ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Gano Ear Clean', 'গ্যানো ইয়ার ক্লিন', 100.00,
 'Natural ear cleaning solution with herbal extracts for safe ear hygiene.',
 'কানের ব্যথা, কান দিয়ে পুঁজ পড়া, শরীরের যে কোন স্থানে পোড়া ও প্রদাহ নিবারণে কার্যকরী।',
 'Use 3-4 drops 1-2 times daily.',
 '৩/৪ ফোঁটা করে প্রতিদিন এক/দুইবার ব্যবহার করতে হবে।', '9 ml', '৯ মিলি');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Ganogesic', 'হার্বস গ্যানোজেসিক', 460.00,
 'Herbal pain relief balm with ganoderma for muscle aches and joint pain.',
 'বাত-ব্যথা, মাথা ব্যথা, আঘাত জনিত ব্যথা ও ফুল নিবারণে কার্যকরী।',
 'Use 2-3 times daily on affected area.',
 'দিন ২-৩ বার আক্রান্ত স্থানে ব্যবহার করতে হবে।', '40 gm', '৪০ গ্রাম');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn) VALUES
('Herbs Honey', 'হার্বস মধু', 240.00, -- Defaulting to the 240 price 175gm, though 500gm is 620
 'Pure natural honey enriched with herbal extracts for immunity and energy.',
 'প্রাকৃতিক মধু শারীরিক, মানসিক শক্তি ও সজীবতা আনয়নে, ক্ষুধা ও স্বরণশক্তি বৃদ্ধিতে এবং দেহের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে কার্যকরী।',
 '1-2 tsp 2 times daily or mix with 1 glass warm water.',
 '১ থেকে ২ চা চামচ দিনে ২ বার চেটে বা ১ গ্লাস কুসুম গরম পানিতে মিশিয়ে সেব্য।', '175 gm/500 gm', '১৭৫ গ্রাম/৫০০ গ্রাম');

-- 9. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-imgs', 'product-imgs', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Storage access policies
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-imgs');

CREATE POLICY "Authenticated Upload Access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-imgs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Access" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-imgs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Access" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-imgs' AND auth.role() = 'authenticated');

