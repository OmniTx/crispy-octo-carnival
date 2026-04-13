import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) as string

const createSupabaseClient = () => createClient(supabaseUrl, supabaseKey)

// Cached version for server components (deduplicates requests within the same render)
export const supabase = cache(createSupabaseClient)

// Direct client instance for client components ('use client' files)
// Client components cannot use React cache() from 'react', so they get a fresh instance
export const supabaseClient = createClient(supabaseUrl, supabaseKey)
