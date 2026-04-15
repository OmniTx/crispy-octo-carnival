'use server'

import { supabase, supabaseAdmin, verifySession } from './supabase'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { revalidateCatalogAndAdmin } from './revalidatePaths'
import { cookies } from 'next/headers'

// Action state for React 19 useActionState
export type ActionState = {
  success: boolean
  error: string | null
  message?: string | null
}

export async function isSetupNeeded(): Promise<boolean> {
  const adminClient = supabaseAdmin()
  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return false
  return users.length === 0
}

export async function setupAdmin(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const isNeeded = await isSetupNeeded()
    if (!isNeeded) {
      return { success: false, error: 'Setup is already completed.' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const adminClient = supabaseAdmin()
    const { data, error: signupError } = await adminClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    })

    if (signupError) {
      return { success: false, error: signupError.message }
    }

    if (data.session) {
      const cookieStore = await cookies()
      cookieStore.set('sb-access-token', data.session.access_token, {
        path: '/',
        maxAge: data.session.expires_in,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      })
      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        maxAge: data.session.expires_in,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      })
    }

    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unknown error occurred' }
  }
}

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const db = supabase()
    const { data, error: loginError } = await db.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      return { success: false, error: loginError.message }
    }

    if (data.session) {
      const cookieStore = await cookies()
      cookieStore.set('sb-access-token', data.session.access_token, {
        path: '/',
        maxAge: data.session.expires_in,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      })
      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        maxAge: data.session.expires_in,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      })
    }

    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unknown error occurred' }
  }
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_bn: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  description: z.string().optional(),
  description_bn: z.string().optional(),
  usage_info: z.string().optional(),
  usage_info_bn: z.string().optional(),
  pack_size: z.string().optional(),
  pack_size_bn: z.string().optional(),
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function validateImage(image: File | null): { error: string | null } {
  if (!image || image.size === 0) return { error: null }
  if (image.size > MAX_FILE_SIZE) return { error: 'Image size must be less than 5MB' }
  if (!ALLOWED_MIME_TYPES.includes(image.type)) {
    return { error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' }
  }
  return { error: null }
}

export async function addProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await verifySession()
    if (!user) return { success: false, error: 'Unauthorized' }

    const name = formData.get('name') as string
    const name_bn = formData.get('name_bn') as string
    const price = formData.get('price')
    const description = formData.get('description') as string
    const description_bn = formData.get('description_bn') as string
    const usage_info = formData.get('usage_info') as string
    const usage_info_bn = formData.get('usage_info_bn') as string
    const pack_size = formData.get('pack_size') as string
    const pack_size_bn = formData.get('pack_size_bn') as string
    const image = formData.get('image') as File | null

    const parsed = productSchema.safeParse({ name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const imageValidation = validateImage(image)
    if (imageValidation.error) {
      return { success: false, error: imageValidation.error }
    }

    let fileName = null

    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop()?.toLowerCase() || 'jpg'
      fileName = `${crypto.randomUUID()}.${fileExt}`
      const db = supabase()
      const { error: uploadError } = await db.storage
        .from('product-imgs')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        return { success: false, error: `Failed to upload image: ${uploadError.message}` }
      }
    }

    // Get max sort_order to place new product at end
    const db = supabase()
    const { data: maxRow } = await db
      .from('products')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxRow?.sort_order ?? 0) + 1

    const { error: dbError } = await db
      .from('products')
      .insert([
        {
          name: parsed.data.name,
          name_bn: parsed.data.name_bn,
          price: parsed.data.price,
          description: parsed.data.description,
          description_bn: parsed.data.description_bn,
          usage_info: parsed.data.usage_info,
          usage_info_bn: parsed.data.usage_info_bn,
          pack_size: parsed.data.pack_size,
          pack_size_bn: parsed.data.pack_size_bn,
          image_url: fileName,
          sort_order: nextOrder,
        },
      ])

    if (dbError) {
      return { success: false, error: `Failed to insert product: ${dbError.message}` }
    }

    revalidateTag('products', 'max')
    revalidatePath('/')
    revalidateCatalogAndAdmin()
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unknown error occurred' }
  }
}

export async function updateProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await verifySession()
    if (!user) return { success: false, error: 'Unauthorized' }

    const id = formData.get('id') as string
    if (!id) {
      return { success: false, error: 'Product id is required' }
    }

    const name = formData.get('name') as string
    const name_bn = formData.get('name_bn') as string
    const price = formData.get('price')
    const description = formData.get('description') as string
    const description_bn = formData.get('description_bn') as string
    const usage_info = formData.get('usage_info') as string
    const usage_info_bn = formData.get('usage_info_bn') as string
    const pack_size = formData.get('pack_size') as string
    const pack_size_bn = formData.get('pack_size_bn') as string
    const image = formData.get('image') as File | null

    const parsed = productSchema.safeParse({ name, name_bn, price, description, description_bn, usage_info, usage_info_bn, pack_size, pack_size_bn })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const db = supabase()
    const { data: existing, error: fetchError } = await db
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return { success: false, error: 'Product not found' }
    }

    const imageValidation = validateImage(image)
    if (imageValidation.error) {
      return { success: false, error: imageValidation.error }
    }

    let image_url: string | null = existing.image_url

    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const { error: uploadError } = await db.storage
        .from('product-imgs')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        return { success: false, error: `Failed to upload image: ${uploadError.message}` }
      }

      if (existing.image_url) {
        await db.storage.from('product-imgs').remove([existing.image_url])
      }
      image_url = fileName
    }

    const { error: dbError } = await db
      .from('products')
      .update({
        name: parsed.data.name,
        name_bn: parsed.data.name_bn || null,
        price: parsed.data.price,
        description: parsed.data.description || null,
        description_bn: parsed.data.description_bn || null,
        usage_info: parsed.data.usage_info || null,
        usage_info_bn: parsed.data.usage_info_bn || null,
        pack_size: parsed.data.pack_size || null,
        pack_size_bn: parsed.data.pack_size_bn || null,
        image_url,
      })
      .eq('id', id)

    if (dbError) {
      return { success: false, error: `Failed to update product: ${dbError.message}` }
    }

    revalidateTag('products', 'max')
    revalidatePath('/')
    revalidateCatalogAndAdmin()
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unknown error occurred' }
  }
}

export async function deleteProduct(id: string, imageUrl: string) {
  const user = await verifySession()
  if (!user) throw new Error('Unauthorized')

  const db = supabase()
  const { error: dbError } = await db
    .from('products')
    .delete()
    .eq('id', id)

  if (dbError) {
    throw new Error(`Failed to delete product: ${dbError.message}`)
  }

  if (imageUrl) {
    await db.storage.from('product-imgs').remove([imageUrl])
  }

  revalidateTag('products', 'max')
  revalidatePath('/')
  revalidateCatalogAndAdmin()
  return { success: true }
}

export async function updateSiteSettings(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await verifySession()
    if (!user) return { success: false, error: 'Unauthorized' }

    const site_name_en = formData.get('site_name_en') as string
    const site_name_bn = formData.get('site_name_bn') as string
    const theme = formData.get('theme') as string
    const currency_symbol = formData.get('currency_symbol') as string

    const db = supabase()
    const { error } = await db
      .from('site_settings')
      .update({
        site_name_en,
        site_name_bn,
        theme,
        currency_symbol,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    if (error) {
      return { success: false, error: `Failed to update settings: ${error.message}` }
    }

    revalidateTag('settings', 'max')
    revalidatePath('/')
    revalidateCatalogAndAdmin()
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unknown error occurred' }
  }
}

export async function bulkImportProducts(
  products: Array<{
    name: string
    price: number
    description: string
    pack_size: string
    pack_size_bn?: string | null
    name_bn?: string | null
    description_bn?: string | null
    usage_info?: string | null
    usage_info_bn?: string | null
  }>
) {
  const user = await verifySession()
  if (!user) throw new Error('Unauthorized')

  if (!products.length) {
    throw new Error('No products to import')
  }

  const rows = products.map((p) => ({
    name: p.name,
    price: p.price,
    description: p.description || '',
    pack_size: p.pack_size || '',
    pack_size_bn: p.pack_size_bn ?? null,
    name_bn: p.name_bn ?? null,
    description_bn: p.description_bn ?? null,
    usage_info: p.usage_info ?? null,
    usage_info_bn: p.usage_info_bn ?? null,
    image_url: null,
  }))

  const db = supabase()
  const { error } = await db
    .from('products')
    .insert(rows)

  if (error) {
    throw new Error(`Failed to import products: ${error.message}`)
  }

  revalidateTag('products', 'max')
  revalidatePath('/')
  revalidateCatalogAndAdmin()
  return { success: true, count: rows.length }
}

export async function reorderProducts(orderedIds: string[]) {
  const user = await verifySession()
  if (!user) throw new Error('Unauthorized')

  // Update sort_order for each product based on array position
  const db = supabase()
  const updates = orderedIds.map((id, index) =>
    db
      .from('products')
      .update({ sort_order: index + 1 })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) {
    throw new Error(`Failed to reorder: ${failed.error.message}`)
  }

  revalidateTag('products', 'max')
  revalidatePath('/')
  revalidateCatalogAndAdmin()
  return { success: true }
}

export async function deleteImage(imageUrl: string) {
  const db = supabase()
  const { error } = await db.storage.from('product-imgs').remove([imageUrl])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }

  return { success: true }
}

export async function listImages() {
  const db = supabase()
  const { data, error } = await db.storage.from('product-imgs').list()

  if (error) {
    throw new Error(`Failed to list images: ${error.message}`)
  }

  return data
}
