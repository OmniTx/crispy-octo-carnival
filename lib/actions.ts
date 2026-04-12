'use server'

import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_bn: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  description: z.string().optional(),
  description_bn: z.string().optional(),
  usage_info: z.string().optional(),
  pack_size: z.string().optional(),
})

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const name_bn = formData.get('name_bn') as string
  const price = formData.get('price')
  const description = formData.get('description') as string
  const description_bn = formData.get('description_bn') as string
  const usage_info = formData.get('usage_info') as string
  const pack_size = formData.get('pack_size') as string
  const image = formData.get('image') as File | null

  const parsed = productSchema.safeParse({ name, name_bn, price, description, description_bn, usage_info, pack_size })
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message)
  }

  let fileName = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('product-imgs')
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }
  }

  const { error: dbError } = await supabase
    .from('products')
    .insert([
      {
        name: parsed.data.name,
        name_bn: parsed.data.name_bn,
        price: parsed.data.price,
        description: parsed.data.description,
        description_bn: parsed.data.description_bn,
        usage_info: parsed.data.usage_info,
        pack_size: parsed.data.pack_size,
        image_url: fileName,
      },
    ])

  if (dbError) {
    throw new Error(`Failed to insert product: ${dbError.message}`)
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteProduct(id: string, imageUrl: string) {
  const { error: dbError } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (dbError) {
    throw new Error(`Failed to delete product: ${dbError.message}`)
  }

  if (imageUrl) {
    await supabase.storage.from('product-imgs').remove([imageUrl])
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateSiteSettings(formData: FormData) {
  const site_name_en = formData.get('site_name_en') as string
  const site_name_bn = formData.get('site_name_bn') as string
  const theme = formData.get('theme') as string
  const currency_symbol = formData.get('currency_symbol') as string

  const { error } = await supabase
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
    throw new Error(`Failed to update settings: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true }
}

export async function bulkImportProducts(
  products: Array<{
    name: string
    price: number
    description: string
    pack_size: string
    name_bn?: string | null
    description_bn?: string | null
    usage_info?: string | null
  }>
) {
  if (!products.length) {
    throw new Error('No products to import')
  }

  const rows = products.map((p) => ({
    name: p.name,
    price: p.price,
    description: p.description || '',
    pack_size: p.pack_size || '',
    name_bn: p.name_bn ?? null,
    description_bn: p.description_bn ?? null,
    usage_info: p.usage_info ?? null,
    image_url: null,
  }))

  const { error } = await supabase
    .from('products')
    .insert(rows)

  if (error) {
    throw new Error(`Failed to import products: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true, count: rows.length }
}
