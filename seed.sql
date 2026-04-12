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
-- ===== Products 01-11 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Reishi Mushroom Powder', 'হার্বস রিশি মাশরুম পাউডার', 800.00,
 'Premium reishi mushroom powder. Supports immune function, cardiovascular health, stress relief, and overall vitality.',
 'দেহের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে। ক্যান্সার, ডায়াবেটিস, উচ্চ রক্তচাপ, হৃদরোগ, কিডনি ও লিভারের সমস্যায় কার্যকর।',
 '২-৩ চা চামচ পাউডার ১ গ্লাস গরম পানিতে মিশিয়ে দিনে ২ বার সেবন করুন।',
 '200gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Oyster Mushroom Powder', 'হার্বস ওয়েস্টার মাশরুম পাউডার', 250.00,
 'Nutrient-dense oyster mushroom powder. Boosts immunity, supports cholesterol management.',
 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে। কোলেস্টেরল ও উচ্চ রক্তচাপ নিয়ন্ত্রণ করে। ক্যান্সার প্রতিরোধে সহায়ক।',
 '১ চা চামচ পাউডার ১ গ্লাস পানিতে মিশিয়ে দিনে ১-২ বার সেবন করুন।',
 '200gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Shiitake Mushroom Powder', 'হার্বস শিতাকে মাশরুম পাউডার', 500.00,
 'High-quality shiitake mushroom powder. Enhances immune defense and supports liver function.',
 'রোগ প্রতিরোধে কার্যকর। হাড়ের ব্যথা, মধুমেহ, কোলেস্টেরল, ক্যান্সার প্রতিরোধে সহায়ক।',
 '১ চা চামচ পাউডার ১ গ্লাস পানিতে মিশিয়ে দিনে ১-২ বার সেবন করুন।',
 '200gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Trio', 'হার্বস মাশরুম ট্রায়ো', 500.00,
 'A powerful blend of three premium mushroom varieties for comprehensive wellness.',
 'রিশি, শিতাকে ও ওয়েস্টার মাশরুমের সমন্বয়ে তৈরি। সার্বিক স্বাস্থ্য সুরক্ষায় কার্যকর।',
 '১ চা চামচ পাইডার দিনে ১ গ্লাস পানিতে মিশিয়ে সেবন করুন।',
 '100gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Shiitake Plus Powder', 'হার্বস শিতাকে প্লাস পাউডার', 680.00,
 'Enhanced shiitake formula with additional herbal extracts for digestive and immune health.',
 'শিতাকে মাশরুম ও ভেষজ উপাদানের সমন্বয়ে তৈরি। হজমশক্তি ও রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
 '১ চা চামচ ১ কাপ গরম পানিতে মিশিয়ে দিনে ১-২ বার সেবন করুন।',
 '300gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Uriflow', 'হার্বস গ্যানো ইউরিফ্লো', 80.00,
 'Herbal supplement for urinary tract health using natural ganoderma extracts.',
 'বৃক্কের পাথর ও প্রস্রাবজনিত সমস্যায় কার্যকর। মূত্রনালীর সংক্রমণ প্রতিরোধ করে।',
 'সকালে ১ টি স্যাশেট ১ গ্লাস পানিতে মিশিয়ে দিনে ১-২ বার সেবন করুন।',
 '1 sachet');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Soya', 'হার্বস মাশরুম সয়া', 430.00,
 'Mushroom-enriched soy protein blend for complete plant-based nutrition.',
 'মাশরুম ও সয়াবিন সমৃদ্ধ পুষ্টিকর খাদ্য। শরীরের প্রোটিনের চাহিদা পূরণ করে।',
 '১-২ চা চামচ দুধ বা পানিতে মিশিয়ে দিনে ১-২ বার সেবন করুন।',
 '200gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Cleanser', 'হার্বস মাশরুম ক্লিনজার', 280.00,
 'Internal body cleanser for detoxification, digestive cleansing, and gut health.',
 'শরীরের অভ্যন্তরীণ পরিষ্কারক। বিষাক্ত পদার্থ দূর করে। পরিপাকতন্ত্র সুস্থ রাখে।',
 'সকালে খালি পেটে ১ গ্লাস কুসুম গরম পানিতে মিশিয়ে দিনে ২ বার সেবন করুন।',
 '100gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Moringa Powder', 'হার্বস মাশরুম মরিঙ্গা পাউডার', 470.00,
 'Powerful combination of medicinal mushrooms and moringa leaf, rich in antioxidants.',
 'মাশরুম ও মরিঙ্গা পাতার সমন্বয়ে তৈরি। আয়রন, ক্যালসিয়াম ও ভিটামিন সমৃদ্ধ।',
 '১ চা চামচ দিনে ২ বার ১ গ্লাস পানিতে মিশিয়ে সেবন করুন।',
 '130gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('HERBS Cordyceps Militaris', 'হার্বস কর্ডিসেপস মিলিটারিস', 1300.00,
 'Premium cordyceps militaris extract. Enhances athletic performance and anti-aging.',
 'রোগ প্রতিরোধে অত্যন্ত কার্যকর। শারীরিক শক্তি বৃদ্ধি করে। ফুসফুসের সমস্যায় সহায়ক।',
 'প্রতিদিন ২০ মিনিট ভিজিয়ে রাখুন। এরপর পানিসহ চুমুক দিয়ে সেবন করুন।',
 '15gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Oyster Mushroom Dry', 'হার্বস ওয়েস্টার মাশরুম ড্রাই', 680.00,
 'Dried whole oyster mushrooms. Ready to cook, rich in protein and fiber.',
 'শুকনো ওয়েস্টার মাশরুম। রান্নায় ব্যবহারযোগ্য। প্রোটিন ও ফাইবার সমৃদ্ধ।',
 'রান্না, স্যুপ, সালাদ, ভর্তা, কারিতে ব্যবহার করুন। প্রতি ১০ মিনিট আগে পানিতে ভিজিয়ে রাখুন।',
 '400gm');

-- ===== Products 12-19 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('GanoTonic Herbs', 'গ্যানো টনিক হার্বস', 1800.00,
 'Premium ganoderma tonic drink for vitality, immunity, and overall wellness.',
 'গ্যানোডার্মা সমৃদ্ধ প্রিমিয়াম টনিক। সার্বিক সুস্থতা ও রোগ প্রতিরোধে কার্যকর।',
 'প্রতিদিন ১ স্যাশেট গরম পানিতে মিশিয়ে সেবন করুন। খালি পেটে সেবন করলে ভালো ফলাফল পাওয়া যায়।',
 '15 sachets');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Gano Sliming Herbs', 'গ্যানো স্লিমিং হার্বস', 750.00,
 'Natural weight management herbal tea supporting metabolism and fat burning.',
 'প্রাকৃতিক ওজন নিয়ন্ত্রণ চা। বিপাক ক্রিয়া বৃদ্ধি করে ও চর্বি কমায়।',
 'প্রতিদিন ১ স্যাশেট এক গ্লাস গরম পানিতে ২০-৩০ মিনিট ভিজিয়ে রেখে সেবন করুন।',
 '15 sachets');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Cap', 'হার্বস গ্যানো ক্যাপ', 450.00,
 'Ganoderma lucidum capsules for daily wellness and immune support.',
 'গ্যানোডার্মা ক্যাপসুল। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও যকৃতের সুরক্ষায় কার্যকর।',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '60 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Oyster Mushroom Capsule', 'হার্বস ওয়েস্টার মাশরুম ক্যাপসুল', 820.00,
 'Oyster mushroom extract in capsule form for cardiovascular health and immunity.',
 'ওয়েস্টার মাশরুম ক্যাপসুল। হৃদরোগ প্রতিরোধ ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে।',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '60 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Noni', 'হার্বস গ্যানো ননি', 500.00,
 'Ganoderma and noni fruit combination for joint health and inflammation reduction.',
 'জয়েন্ট স্বাস্থ্য ও প্রদাহ হ্রাসে কার্যকর। গ্যানোডার্মা ও ননি ফলের সমন্বয়।',
 '১-২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Fresh', 'হার্বস গ্যানো ফ্রেশ', 440.00,
 'Refreshing ganoderma supplement for daily vitality and mental clarity.',
 'দৈনিক সতেজতা ও মানসিক স্বচ্ছতার জন্য গ্যানোডার্মা সাপ্লিমেন্ট।',
 '১ টি করে ক্যাপসুল দিনে ১ বার ২ মাস পর্যন্ত সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Hepatec', 'হার্বস গ্যানো হেপাটেক', 500.00,
 'Liver support formula with ganoderma extract for liver detoxification.',
 'লিভার সুরক্ষা ফর্মুলা। যকৃতের ডিটক্সিফিকেশন ও সুস্থ কার্যকারিতায় সহায়ক।',
 '১-২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Slim', 'হার্বস গ্যানো স্লিম', 550.00,
 'Weight management capsules supporting healthy metabolism.',
 'ওজন নিয়ন্ত্রণ ক্যাপসুল। স্বাস্থ্যকর বিপাক ক্রিয়া সমর্থন করে।',
 '১ টি ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '30 caps');

-- ===== Products 20-32 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Methi', 'হার্বস মাশরুম মেথি', 430.00,
 'Mushroom and fenugreek for blood sugar management and digestive health.',
 'মাশরুম ও মেথির সমন্বয়। রক্তে শর্করা নিয়ন্ত্রণ ও হজমশক্তি বৃদ্ধিতে কার্যকর।',
 '২ টি করে ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '70 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Reishi Tongkat Ali', 'হার্বস রিশি টংকাট আলী', 1200.00,
 'Premium blend of reishi mushroom and tongkat ali for hormonal balance.',
 'রিশি মাশরুম ও টংকাট আলীর মিশ্রণ। শারীরিক শক্তি ও হরমোনের ভারসাম্য রক্ষায় কার্যকর।',
 '১ টি ক্যাপসুল দিনে ১ বার ১ মাস পর্যন্ত সেবন করুন।',
 '15 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Gynura', 'হার্বস মাশরুম গাইনুরা', 250.00,
 'Mushroom and gynura leaf extract for blood pressure and cholesterol management.',
 'রক্তচাপ ও কোলেস্টেরল নিয়ন্ত্রণে কার্যকর। প্রাকৃতিক ডিটক্সিফিকেশনে সহায়ক।',
 '২-৩ টি ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Ganocid', 'হার্বস গ্যানোসিড', 480.00,
 'Ganoderma-based supplement for gastric health and digestive comfort.',
 'গ্যাস্ট্রিক সমস্যায় কার্যকর। পেটের আলসার ও অ্যাসিডিটি কমায়।',
 '১-২ টি ক্যাপসুল দিনে ২-৩ বার আহারের পূর্বে সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Ginseng', 'হার্বস গ্যানো জিনসেং', 840.00,
 'Powerful combination of ganoderma and ginseng for stamina and mental focus.',
 'শারীরিক ও মানসিক শক্তি বৃদ্ধিতে গ্যানোডার্মা ও জিনসেং-এর সমন্বয়।',
 '১ টি করে ক্যাপসুল রাতে ২ টি দিনে ২ বার। খালি পেটে গরম পানিসহ সেবন করুন।',
 '10 sachets');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Charcoal', 'হার্বস গ্যানো চারকোল', 600.00,
 'Activated charcoal with ganoderma for digestive detox and intestinal health.',
 'অ্যাক্টিভেটেড চারকোল ও গ্যানোডার্মা সমৃদ্ধ। পরিপাকতন্ত্র পরিষ্কার রাখে।',
 '১-২ টি ক্যাপসুল দিনে ২ বার আহারের পরে সেবন করুন।',
 '50 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Ganokuma', 'হার্বস গ্যানোকুমা', 480.00,
 'Ganoderma and turmeric blend for anti-inflammatory support and immunity.',
 'গ্যানোডার্মা ও হলুদের মিশ্রণ। প্রদাহ নিরোধক ও রোগ প্রতিরোধে কার্যকর।',
 '১-২ টি করে ক্যাপসুল প্রতিদিন ১/২ বার খালি পেটে সেবন করুন।',
 '30 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano GT Special', 'হার্বস গ্যানো জিটি স্পেশাল', 1200.00,
 'Special edition ganoderma tea for enhanced vitality and immune support.',
 'বিশেষ সংস্করণ গ্যানোডার্মা চা। সজীবতা ও রোগ প্রতিরোধ বৃদ্ধিতে কার্যকর।',
 '১ টি করে ক্যাপসুল দিনে ৩ টি দিনে ১ বার। গরম পানিতে সেবন করুন।',
 '25 sachets');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Mycelium', 'হার্বস গ্যানো মাইসেলিয়াম', 600.00,
 'Pure ganoderma mycelium capsules rich in polysaccharides for immune support.',
 'গ্যানোডার্মা মাইসেলিয়াম ক্যাপসুল। পলিস্যাকারাইড সমৃদ্ধ। ইমিউন সিস্টেম শক্তিশালী করে।',
 '২ টি করে ক্যাপসুল দিনে ২ বার আহারের পূর্বে সেবন করুন।',
 '60 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Moringa Cap', 'হার্বস মাশরুম মরিঙ্গা ক্যাপ', 500.00,
 'Moringa and mushroom extract capsules packed with vitamins and antioxidants.',
 'মরিঙ্গা ও মাশরুম নির্যাস ক্যাপসুল। ভিটামিন ও অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ।',
 '২ টি করে ক্যাপসুল দিনে ২ বার আহারের পূর্বে সেবন করুন।',
 '60 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Spiruvil-C', 'স্পিরুভিল-সি', 290.00,
 'Spirulina with vitamin C supplement for immune function and energy.',
 'স্পিরুলিনা ও ভিটামিন সি সাপ্লিমেন্ট। রোগ প্রতিরোধ ও শক্তি বৃদ্ধিতে সহায়ক।',
 'আয়রনের ঘাটতি পূরণে- ১ টি করে ক্যাপসুল দিনে ১-২ বার আহারের পূর্বে সেবন করুন।',
 '50 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Spirulina-H', 'স্পিরুলিনা-এইচ', 420.00,
 'Premium spirulina capsules rich in protein, B vitamins, iron, and antioxidants.',
 'প্রোটিন, বি ভিটামিন, আয়রন ও অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ স্পিরুলিনা ক্যাপসুল।',
 'আয়রনের ঘাটতি পূরণে- ১ টি করে ক্যাপসুল দিনে ১-২ বার। ১-২ বছর আহারের পরে সেবন করুন।',
 '82 caps');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Extract', 'হার্বস মাশরুম এক্সট্রাক্ট', 810.00,
 'Concentrated liquid mushroom extract delivering full spectrum health benefits.',
 'ঘনীভূত মাশরুম নির্যাস। সম্পূর্ণ মাশরুমের স্বাস্থ্য উপকারিতা প্রদান করে।',
 'আয়রনের ঘাটতি পূরণে- ২-৩ টি চা চামচ দিনে ১ বার। ১-২ মাস আহারের পূর্বে সেবন করুন।',
 '350ml');

-- ===== Products 33-44 =====

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs GL Tonic', 'হার্বস জিএল টনিক', 1000.00,
 'Ganoderma lucidum health tonic for liver support, immunity, and vitality.',
 'গ্যানোডার্মা লুসিডাম হেলথ টনিক। লিভার সুরক্ষা, রোগ প্রতিরোধ ও সজীবতায় কার্যকর।',
 '২-৩ চা চামচ সকাল সন্ধ্যা পানিতে মিশিয়ে দিনে ২ বার আহারের পূর্বে সেবন করুন।',
 '850ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Bar', 'হার্বস মাশরুম বার', 310.00,
 'Nutritious mushroom-enriched soap bar for healthy, glowing skin.',
 'মাশরুম সমৃদ্ধ সাবান বার। ত্বকের যত্নে কার্যকর।',
 'মুখমণ্ডল, হাত ও শরীরে ব্যবহার করুন। ১০-১৫ মিনিট রেখে ধুয়ে ফেলুন।',
 '75gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Hair Oil', 'হার্বস হেয়ার অয়েল', 850.00,
 'Herbal hair oil enriched with mushroom extracts for hair growth and scalp nourishment.',
 'মাশরুম নির্যাস সমৃদ্ধ হেয়ার অয়েল। চুলের বৃদ্ধি ও মাথার ত্বকের যত্নে কার্যকর।',
 'আঙুলের ডগায় তেল নিয়ে মাথায় ম্যাসাজ করুন। সারারাত রেখে সকালে ধুয়ে ফেলুন।',
 '200ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Glow Cream', 'হার্বস গ্যানো গ্লো ক্রিম', 350.00,
 'Ganoderma-infused skin cream that moisturizes, brightens, and protects skin.',
 'গ্যানোডার্মা সমৃদ্ধ স্কিন ক্রিম। ত্বক উজ্জ্বল, ময়েশ্চারাইজড ও সুরক্ষিত রাখে।',
 'মুখমণ্ডলে ক্রিম লাগিয়ে হালকাভাবে ম্যাসেজ করুন। দিনে ২ বার ব্যবহার করুন।',
 '30gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Ganode Shampoo', 'হার্বস গ্যানোড শ্যাম্পু', 810.00,
 'Premium herbal shampoo with ganoderma extract for strong, nourished hair.',
 'গ্যানোডার্মা সমৃদ্ধ প্রিমিয়াম শ্যাম্পু। চুলের গোড়া শক্ত করে ও চুল পড়া রোধ করে।',
 'ভেজা চুলে শ্যাম্পু লাগিয়ে আস্তে আস্তে ম্যাসেজ করুন। ৩-৫ মিনিট পর ধুয়ে ফেলুন।',
 '200ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Gano G Oil', 'গ্যানো জি অয়েল', 500.00,
 'Multipurpose ganoderma essential oil for muscle soothing and skin health.',
 'বহুমুখী গ্যানোডার্মা এসেনশিয়াল অয়েল। পেশী শিথিল ও ত্বকের স্বাস্থ্যে কার্যকর।',
 '৪-৫ ফোঁটা নিয়ে ম্যাসাজ করুন। দিনে ২-৩ বার ব্যবহার করুন।',
 '8ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Genital', 'হার্বস মাশরুম জেনিটাল অয়েন্টমেন্ট', 500.00,
 'Herbal ointment for intimate care with natural mushroom-based formulation.',
 'প্রাকৃতিক মাশরুম ভিত্তিক ওষুধ। ব্যক্তিগত পরিচ্ছন্নতায় কার্যকর।',
 'প্রয়োজনমতো আক্রান্ত স্থানে লাগিয়ে ৩-৫ মিনিট মালিশ করুন।',
 '30gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano Neem Oil', 'হার্বস গ্যানো নিম অয়েল', 340.00,
 'Neem oil enhanced with ganoderma extract for skin issues and antiseptic care.',
 'নিম তেল ও গ্যানোডার্মা নির্যাস সমৃদ্ধ। ত্বকের সমস্যায় ও জীবাণুনাশক হিসেবে কার্যকর।',
 'আক্রান্ত স্থানে ভালো করে সামান্য পরিমাণ তেল দিনে ২-৩ বার ব্যবহার করুন।',
 '30ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Mushroom Karanja Oil', 'হার্বস মাশরুম করঞ্জা অয়েল', 200.00,
 'Karanja seed oil with mushroom extracts for wound healing and skin conditions.',
 'করঞ্জা বীজ তেল ও মাশরুম নির্যাস সমৃদ্ধ। ক্ষত নিরাময় ও ত্বকের সমস্যায় কার্যকর।',
 'আক্রান্ত স্থানে ব্যবহার করুন। দিনে ১-২ বার ব্যবহার করুন।',
 '8ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Gano D Care', 'হার্বস গ্যানো ডি কেয়ার', 920.00,
 'Dental and oral care solution with ganoderma for gum health and fresh breath.',
 'গ্যানোডার্মা সমৃদ্ধ দাঁত ও মুখের যত্নের দ্রবণ। মাড়ির স্বাস্থ্য ও সতেজ শ্বাসে কার্যকর।',
 '৩-৭ দিন ধরে ব্রাশে গুঁড়ো নিয়ে আস্তে আস্তে মাজুন। দিনে সকালে ও রাতে ব্যবহার করুন।',
 '50ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Gano Ear Clean', 'গ্যানো ইয়ার ক্লিন', 200.00,
 'Natural ear cleaning solution with herbal extracts for safe ear hygiene.',
 'প্রাকৃতিক কানের পরিষ্কারক দ্রবণ। নিরাপদ কানের স্বাস্থ্যবিধিতে কার্যকর।',
 '৩/৪ ফোঁটা কানে প্রয়োগ করুন এবং ৫ মিনিট পর তুলো দিয়ে মুছুন।',
 '8ml');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Ganogesic', 'হার্বস গ্যানোজেসিক', 430.00,
 'Herbal pain relief balm with ganoderma for muscle aches and joint pain.',
 'গ্যানোডার্মা সমৃদ্ধ ব্যথানাশক মলম। পেশী ও জয়েন্টের ব্যথায় কার্যকর।',
 'দিনে ২-৩ বার আক্রান্ত স্থানে মলম লাগিয়ে ম্যাসাজ করুন।',
 '40gm');

INSERT INTO public.products (name, name_bn, price, description, description_bn, usage_info, pack_size) VALUES
('Herbs Honey', 'হার্বস মধু', 240.00,
 'Pure natural honey enriched with herbal extracts for immunity and energy.',
 'প্রাকৃতিক মধু। শরীরের শক্তি ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে সহায়ক।',
 '১ চামচ ২ চা চামচ দিনে ২ বার চেটে খান। ১ গ্লাস কুসুম গরম পানিতে মিশিয়েও সেবন করতে পারেন।',
 '175gm');

-- 7. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-imgs', 'product-imgs', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage access policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-imgs');
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-imgs');
CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'product-imgs');
