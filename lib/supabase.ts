import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) as string

const createSupabaseClient = () => createClient(supabaseUrl, supabaseKey)

// Cached version for server components (deduplicates requests within the same render)
export const supabase = cache(createSupabaseClient)

/** 
 * Fetch site settings using Vercel's Data Cache (unstable_cache).
 * This persists across requests and is shared globally on Vercel.
 */
export const getSettings = cache(async () => {
  return unstable_cache(
    async () => {
      const db = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await db
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (error) throw error
      return { data }
    },
    ['site-settings'],
    { revalidate: 3600, tags: ['settings'] }
  )()
})

/**
 * Fetch products using Vercel's Data Cache (unstable_cache).
 */
export const getProducts = cache(async () => {
  return unstable_cache(
    async () => {
      const db = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await db
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return { data }
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
  )()
})

/**
 * Verify session on the server side for sensitive operations.
 */
export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value

  if (!token) return null

  const db = createClient(supabaseUrl, supabaseKey)
  const { data: { user }, error } = await db.auth.getUser(token)

  if (error || !user) return null
  return user
}

// Direct client instance for client components ('use client' files)
// Client components cannot use React cache() from 'react', so they get a fresh instance
export const supabaseClient = createClient(supabaseUrl, supabaseKey)
