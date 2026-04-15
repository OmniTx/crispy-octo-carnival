# CONTEXT.md - Herbs Showcase (Full-Stack E-Commerce / Catalog)

**Paste this file into every AI session to provide full project context.**

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.2 + Custom CSS (dynamic theming)
- **Language**: TypeScript 6.0 (strict mode)
- **Form Handling**: React Hook Form 7.72 + Zod 4.3 validation
- **Icons**: Lucide React 1.8
- **Image Handling**: Custom Supabase image loader

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase GoTrue Auth (JWT-based sessions)
- **Storage**: Supabase Storage (`product-imgs` bucket)
- **Caching**: Vercel Data Cache with `unstable_cache` and `revalidateTag`

### Deployment
- **Primary**: Vercel (optimized)
- **Alternative**: cPanel Node.js via GitHub Actions
- **Build Output**: Standalone mode

---

## 📊 Database Schema

### `products` Table
```sql
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
```

**Fields:**
- `id`: UUID primary key
- `name`: Product name (English) - **required**
- `name_bn`: Product name (Bengali)
- `price`: Product price (numeric, 2 decimal places) - **required**
- `description`: Product description (English)
- `description_bn`: Product description (Bengali)
- `usage_info`: Usage instructions (English)
- `usage_info_bn`: Usage instructions (Bengali)
- `pack_size`: Package size/quantity (English)
- `pack_size_bn`: Package size/quantity (Bengali)
- `image_url`: Filename in Supabase storage bucket `product-imgs`
- `created_at`: Timestamp of creation
- `sort_order`: Integer for manual product ordering

### `site_settings` Table
```sql
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_name_en text DEFAULT 'Herbs Showcase',
  site_name_bn text DEFAULT 'হার্বস শোকেস',
  theme text DEFAULT 'dark',
  currency_symbol text DEFAULT '৳',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

**Fields:**
- `id`: Always 1 (single-row table)
- `site_name_en`: Site name in English
- `site_name_bn`: Site name in Bengali
- `theme`: 'light' or 'dark'
- `currency_symbol`: Currency symbol (default: '৳')
- `updated_at`: Last update timestamp

**Note:** RLS (Row Level Security) is **disabled** on both tables.

---

## 🗂️ Storage

### Supabase Storage Bucket: `product-imgs`
- Stores product images
- Files are uploaded with random filenames
- Images are deleted when products are deleted or updated
- Public access (no RLS)

---

## 🌐 Internationalization (i18n)

### Supported Languages
- **en**: English
- **bn**: Bengali (বাংলা)

### Routing
- All routes are under `app/[lang]/`
- Root `/` redirects to `/en`
- Language is part of the URL structure

### Dictionary System
Located in `i18n/dictionaries.ts`, provides translations for UI strings in both languages.

---

## 🔐 Authentication

### Admin Authentication
- Uses Supabase Auth (GoTrue)
- Session stored in cookie: `sb-access-token`
- Server-side verification via `verifySession()` in `lib/supabase.ts`
- Protected routes: `/[lang]/admin/**`

### Session Verification
```typescript
// Server-side verification for sensitive operations
const user = await verifySession()
if (!user) return { success: false, error: 'Unauthorized' }
```

---

## ⚙️ Server Actions

All mutations go through **Server Actions** in `lib/actions.ts`:

### Available Actions
1. **`addProduct`** - Create new product with optional image upload
2. **`updateProduct`** - Update existing product with image replacement
3. **`deleteProduct`** - Delete product and associated image
4. **`updateSiteSettings`** - Update site-wide settings
5. **`bulkImportProducts`** - Import products via CSV
6. **`reorderProducts`** - Update product sort order
7. **`deleteImage`** - Delete image from storage
8. **`listImages`** - List all images in storage

### Validation
- Uses Zod schema for product data validation
- Server-side verification of user session for all mutations

### Cache Invalidation
All mutations trigger cache invalidation:
```typescript
revalidateTag('products', 'max')  // or 'settings', 'max'
revalidatePath('/')
revalidateCatalogAndAdmin()  // Revalidates /en, /en/admin, /bn, /bn/admin
```

**Note:** Next.js 16 requires a second `profile` argument for `revalidateTag`. Use `'max'` for stale-while-revalidate semantics, or `{ expire: 0 }` for immediate expiration.

---

## 📁 Project Structure

```
crispy-octo-carnival/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx         # Root layout (theme, language, header)
│   │   ├── page.tsx           # Home page (product catalog)
│   │   ├── admin/             # Admin dashboard (protected)
│   │   └── login/             # Login page
│   └── globals.css            # Global styles, Tailwind config
├── components/
│   ├── ThemeToggle.tsx        # Light/dark mode toggle
│   ├── HeaderAdminLink.tsx    # Session-aware admin link
│   ├── ProductCard.tsx        # Product display card
│   ├── AdminSidebar.tsx       # Admin navigation
│   ├── AdminProductTable.tsx  # Product management table
│   └── ImageManager.tsx       # Image upload/delete UI
├── lib/
│   ├── supabase.ts            # Server-side Supabase client + cached fetchers
│   ├── supabase-client.ts     # Client-side Supabase instance
│   ├── actions.ts             # All server actions (mutations)
│   ├── csv.ts                 # CSV import/export utilities
│   └── revalidatePaths.ts     # Multi-language path revalidation
├── i18n/
│   └── dictionaries.ts        # English and Bengali translations
├── public/                    # Static assets
├── seed.sql                   # Database schema + seed data
├── next.config.js             # Next.js config (standalone, images)
├── tsconfig.json              # TypeScript config (strict mode)
└── package.json               # Dependencies and scripts
```

---

## 🛠️ Conventions & Patterns

### Code Style
- **TypeScript**: Strict mode enabled
- **Imports**: Use `@/*` path alias for root imports
- **Server Components**: Default (no `'use client'` directive)
- **Client Components**: Explicit `'use client'` at top of file
- **File Naming**: PascalCase for components, camelCase for utilities

### Data Fetching
- Server components use cached fetchers: `getSettings()`, `getProducts()`
- Uses `unstable_cache` with tags for Vercel Data Cache
- Cache duration: 3600 seconds (1 hour)
- Manual invalidation via `revalidateTag`

### Form Handling
- React Hook Form with Zod resolver
- Server actions use `FormData` for input
- Form state managed by React 19 `useActionState`

### Image Handling
- Custom Supabase image loader (`supabase-image-loader.js`)
- Images stored in `product-imgs` bucket
- Random filenames generated on upload
- Old images deleted when replaced

### Caching Strategy
- **Settings**: Cached with tag `'settings'`
- **Products**: Cached with tag `'products'`
- **Paths**: Both `/en` and `/bn` revalidated on changes
- **Admin paths**: `/en/admin` and `/bn/admin` revalidated on changes

### Error Handling
- Server actions return `ActionState` type:
  ```typescript
  type ActionState = {
    success: boolean
    error: string | null
    message?: string | null
  }
  ```
- All actions check for user authentication
- Database errors caught and returned as strings

### Database Constraints
- `name` and `price` are required for products
- `site_settings` is constrained to single row (id = 1)
- RLS disabled for simplicity

---

## 📝 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (clears .next first)
npm run start    # Start production server
npm run lint     # Lint app, components, and lib directories
```

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
```

---

## 🎯 Key Features

1. **Bilingual Support**: English and Bengali with automatic language detection
2. **Admin Dashboard**: Secure product and settings management
3. **Image Management**: Centralized image library with upload/delete
4. **Bulk Import/Export**: CSV-based catalog management
5. **Theme Toggle**: Light/dark mode with localStorage persistence
6. **Responsive Design**: Mobile-first, fully responsive UI
7. **Cached Data Fetching**: Optimized for Vercel deployment
8. **Drag-and-Drop**: Product reordering in admin panel

---

## ⚠️ Important Notes

- **Build one feature at a time**: Provide the AI with a single component or API route to build
- **All database mutations** must go through server actions in `lib/actions.ts`
- **Cache invalidation** is manual - always call `revalidateTag` and `revalidatePath` after mutations
- **Authentication** is required for all admin operations
- **RLS is disabled** - be cautious with direct database access
- **Images** are stored in Supabase storage, not in the filesystem

---

**Last Updated**: April 15, 2026
