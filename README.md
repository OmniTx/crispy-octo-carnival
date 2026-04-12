# IBM Showcase Full-Stack App

A minimal, dual-language (English/Bangla) Next.js 14 Web Application styled with an IBM/Oracle aesthetic using Tailwind CSS. Uses Supabase for Database and Storage, built purely on Edge functions and Next.js App Router Server Actions.

## Requirements
- Node.js installed

## 1. Local Setup

First, install all of the dependencies:
```bash
npm install
```

Copy your environment variables:
```bash
cp .env.local.example .env.local
```
*(You will fill these out after completing "Supabase Setup" below)*.

Start the development server:
```bash
npm run dev
```

---

## 2. Supabase Setup (Detailed)

Supabase handles our Postgres database and our image storage.

1. **Create an Account / Project**:
   - Go to [Supabase](https://supabase.com/) and sign up.
   - Click "New Project", give it a name like "showcase-db", set a strong database password, and choose a region close to you.
   - Wait for the database to finish provisioning (~1-2 minutes).

2. **Run the Database Setup (seed.sql)**:
   - On the left sidebar of your Supabase dashboard, click on **SQL Editor**.
   - Click "New Query" and paste the *entire* contents of the `seed.sql` file provided in this repository.
   - Click the "Run" button. This will automatically create your `products` table, disable row level security (for simplicity), create the `product-imgs` storage bucket, and make it publicly accessible!

3. **Get Your Environment Variables**:
   - On the left sidebar, click on **Project Settings** (the gear icon at the very bottom).
   - Click on **API** under Configuration.
   - Under "Project URL", copy the URL and paste it into your `.env.local` file as `NEXT_PUBLIC_SUPABASE_URL`.
   - Under "Project API keys", copy the `anon` `public` key and paste it into your `.env.local` file as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

*(The app should now work fully on your local machine)*

---

## 3. Vercel Deployment (Detailed)

You have a zero-config, edge-ready app here. Deploying to Vercel is extremely simple.

1. **Push to GitHub**:
   - Commit all your code and push it to a new repository on your GitHub account.

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com) and log in with your GitHub account.
   - Click **Add New...** and select **Project**.
   - Import the GitHub repository you just created.

3. **Add Environment Variables to Vercel**:
   - Before clicking "Deploy", open the **Environment Variables** section on the Vercel setup page.
   - Add `NEXT_PUBLIC_SUPABASE_URL` and paste the value.
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` and paste the value.
   
4. **Deploy**:
   - Click **Deploy**. Vercel will automatically detect Next.js 14, run `npm run build`, and serve your pages using the Edge Network.
   - Once deployment finishes, you can visit the URL Vercel gives you. Ensure everything is working by adding and deleting a product!

## Note on Architecture
- **No separate server:** Adds and Deletes are handled entirely via Next.js Edge Server Actions (`lib/actions.ts`).
- **Images:** Supabase image loader is pre-configured in `next.config.js`. Next.js handles size variations efficiently.
