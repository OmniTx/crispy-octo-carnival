'use server'

import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const runtime = 'edge'

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  description: z.string().optional(),
})

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = formData.get('price')
  const description = formData.get('description') as string
  const image = formData.get('image') as File | null

  // Validate fields
  const parsed = productSchema.safeParse({ name, price, description })
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message)
  }

  let fileName = null

  // Upload image to Supabase Storage only if it exists
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

  // Insert into DB
  const { error: dbError } = await supabase
    .from('products')
    .insert([
      {
        name: parsed.data.name,
        price: parsed.data.price,
        description: parsed.data.description,
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
  // Delete from DB first
  const { error: dbError } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (dbError) {
    throw new Error(`Failed to delete product: ${dbError.message}`)
  }

  // Delete from storage
  if (imageUrl) {
    await supabase.storage.from('product-imgs').remove([imageUrl])
  }

  revalidatePath('/')
  return { success: true }
}
