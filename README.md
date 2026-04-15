# Herbs Showcase (Full-Stack E-Commerce / Catalog)

A modern, fast, and fully responsive web application built to showcase herbal products, featuring an integrated admin panel, bilingual support (English and Bengali), and an automated deployment pipeline.

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.2 + Custom CSS (for dynamic theming)
- **Language/Type Checker**: TypeScript 6.0
- **Database & Authentication**: Supabase (PostgreSQL, GoTrue Auth, Storage)
- **Form Handling & Validation**: React Hook Form 7.72 + Zod 4.3
- **Icons**: Lucide React 1.8
- **Hosting/Deployment**: Vercel & GitHub Actions (for cPanel builds)

## ✨ Key Features

- **Bilingual Interface (i18n)**: Seamlessly switch between English and Bengali. Includes automatic language detection based on the user's geographic location (defaults to the Bengali version for visitors from Bangladesh).
- **Advanced Font Rendering**: Intelligent typography that prioritizes the Inter font for English characters while flawlessly falling back to self-hosted Noto Serif Bengali for native text, even within the same sentence.
- **Admin Dashboard**: A secure, password-protected area to manage the catalog.
  - **Product Management**: Add, edit, delete, and reorder products with drag-and-drop.
  - **Image Library**: Centralized asset manager.
  - **Site Settings**: Customize the site name, currency symbol, and default theme (Dark/Light).
  - **Bulk Import/Export**: Easily manage catalog data using CSV files.
- **Modern Aesthetics**: A premium, "alive" design featuring soft hover states, tabular numbers for pricing, and distinct light/dark modes.

## 🛠️ Local Development

### Prerequisites
- Node.js (v22+)
- Supabase Account

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd crispy-octo-carnival
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Rename `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Vercel (Recommended)
This project is configured out-of-the-box for Vercel. Simply connect your GitHub repository to Vercel and ensure you add the required `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in your Vercel project settings.

### cPanel / Node.js Server
You can manually trigger a GitHub Action to generate a production-ready `.zip` file optimized for cPanel's Node.js App environment. This uses Next.js's "standalone" output mode.

1. Go to the **Actions** tab in this GitHub repository.
2. Select **Build for cPanel** from the left sidebar.
3. Click the **Run workflow** dropdown and select the `main` branch.
4. Once the workflow completes successfully, scroll to the bottom of the summary page and download the `cpanel-build` artifact.
5. Upload and extract the `.zip` file to your cPanel server.
6. In your cPanel **Setup Node.js App** settings, set the Application startup file to `server.js`.
7. Define the required Supabase environment variables in the cPanel UI.

*Note: The GitHub Action uses dummy Supabase keys during the build process, which is generally fine for this app. However, if your specific pages strictly require real keys to be evaluated during static generation at build-time, you should add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your repository's **GitHub Secrets**.*

## 📂 Project Structure & File Overview

### 🌐 Core Routing (`app/`)
The application uses the **Next.js App Router** with internationalization (`[lang]`) at its core.
- `app/[lang]/layout.tsx`: The **Root Layout**. It handles site-wide settings, themes (including a flash-prevention script), and the common header/navigation. It uses cached site settings for maximum performance.
- `app/[lang]/page.tsx`: The **Home Page**. Displays the product catalog. Optimized with Vercel Data Cache for near-instant loads.
- `app/[lang]/admin/`: The **Admin Dashboard**. A protected area for managing products, settings, and assets.
- `app/[lang]/login/`: The **Login Page**. Handles admin authentication.
- `app/globals.css`: Global styles, Tailwind CSS configuration, and custom theme variables.

### 🧩 Reusable Components (`components/`)
- `ThemeToggle.tsx`: Client-side component for switching between Light and Dark modes (saved to `localStorage`).
- `HeaderAdminLink.tsx`: A session-aware link that only shows the "Admin" gear icon if the user is logged in.
- `ProductCard.tsx`: Standardized card for displaying product details (image, name, price, description).
- `AdminSidebar.tsx`: Navigation for the admin dashboard.
- `AdminProductTable.tsx`: Interactive table for managing and reordering products.
- `ImageManager.tsx`: Interface for uploading and deleting product images.

### ⚙️ Logic & Utilities (`lib/`)
- `lib/supabase.ts`: **Supabase Configuration**. Includes:
    - `getSettings()`: Cached fetcher for site-wide settings (name, currency, default theme).
    - `getProducts()`: Cached fetcher for the entire product list.
    - `verifySession()`: **Security Layer** that validates the user's JWT on the server for admin pages and actions.
- `lib/actions.ts`: **Server Actions**. Handles all database mutations (Add/Edit/Delete/Reorder/Import). Includes automatic **Cache Invalidation** (`revalidateTag`) to keep the site updated after changes.
- `lib/revalidatePaths.ts`: Helper to trigger revalidation across multiple language paths simultaneously.

### 🛡️ Middleware & Config
- `middleware.ts`: Handles root path redirection (`/` -> `/en`) and provides basic route protection for the admin area.
- `i18n/dictionaries.ts`: Centralized English and Bengali translations used throughout the app.
- `next.config.js`: Next.js specific settings, including "standalone" output and custom Supabase image loading.
- `seed.sql`: The complete database schema (PostgreSQL) and initial product data for setting up the Supabase backend.
