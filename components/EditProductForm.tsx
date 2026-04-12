'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateProduct } from '@/lib/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/i18n/dictionaries'
import { Save } from 'lucide-react'
import Image from 'next/image'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  name_bn: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
  description: z.string().optional(),
  description_bn: z.string().optional(),
  usage_info: z.string().optional(),
  usage_info_bn: z.string().optional(),
  pack_size: z.string().optional(),
})

type FormValues = z.infer<typeof productSchema>

export type EditableProduct = {
  id: string
  name: string
  name_bn: string | null
  price: number
  description: string | null
  description_bn: string | null
  usage_info: string | null
  usage_info_bn: string | null
  pack_size: string | null
  image_url: string | null
}

export default function EditProductForm({
  product,
  dict,
  lang,
}: {
  product: EditableProduct
  dict: Dictionary
  lang: string
}) {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      name_bn: product.name_bn ?? '',
      price: product.price,
      description: product.description ?? '',
      description_bn: product.description_bn ?? '',
      usage_info: product.usage_info ?? '',
      usage_info_bn: product.usage_info_bn ?? '',
      pack_size: product.pack_size ?? '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('id', product.id)
      formData.append('name', data.name)
      formData.append('name_bn', data.name_bn || '')
      formData.append('price', data.price.toString())
      formData.append('description', data.description || '')
      formData.append('description_bn', data.description_bn || '')
      formData.append('usage_info', data.usage_info || '')
      formData.append('usage_info_bn', data.usage_info_bn || '')
      formData.append('pack_size', data.pack_size || '')
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await updateProduct(formData)
      router.push(`/${lang}/admin`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : dict.error
      setErrorMsg(message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto border theme-border theme-bg p-8 shadow-2xl">
      {errorMsg && (
        <div className="mb-6 p-4 border border-red-600 text-red-500 bg-red-950/50 font-mono text-sm">{errorMsg}</div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="ibm-label">{dict.name} (English)</label>
            <input type="text" {...register('name')} className="ibm-input" />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="ibm-label font-bangla">{dict.name} (বাংলা)</label>
            <input type="text" {...register('name_bn')} className="ibm-input font-bangla" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="ibm-label">{dict.price}</label>
            <input type="number" step="0.01" {...register('price')} className="ibm-input font-mono" />
            {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price.message as string}</p>}
          </div>
          <div>
            <label className="ibm-label">{dict.packSize}</label>
            <input type="text" {...register('pack_size')} placeholder="e.g. 200gm, 30 caps" className="ibm-input" />
          </div>
        </div>

        <div>
          <label className="ibm-label">{dict.description} (English)</label>
          <textarea {...register('description')} rows={3} className="ibm-input" />
        </div>
        <div>
          <label className="ibm-label font-bangla">{dict.description} (বাংলা)</label>
          <textarea {...register('description_bn')} rows={3} className="ibm-input font-bangla" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="ibm-label">Usage / Dosage (English)</label>
            <textarea {...register('usage_info')} rows={2} className="ibm-input" />
          </div>
          <div>
            <label className="ibm-label font-bangla">সেবন/ব্যবহারবিধি (বাংলা)</label>
            <textarea {...register('usage_info_bn')} rows={2} className="ibm-input font-bangla" />
          </div>
        </div>

        <div>
          <label className="ibm-label">
            {dict.image} <span className="theme-text-muted font-normal ml-2">({dict.optional})</span>
          </label>
          {product.image_url && !imageFile ? (
            <div className="mb-3 relative h-32 w-32 border theme-border theme-bg-card">
              <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" />
            </div>
          ) : null}
          <div className="border border-dashed theme-border theme-bg-card p-4 transition-colors hover:border-ibm-blue">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-ibm-blue file:text-white hover:file:brightness-110 transition-all cursor-pointer"
            />
          </div>
          {imageFile ? (
            <p className="text-xs theme-text-muted mt-2">{imageFile.name}</p>
          ) : null}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${lang}/admin`)}
            className="ibm-btn theme-bg-card border theme-border theme-text flex-1 justify-center"
          >
            {dict.cancel}
          </button>
          <button type="submit" disabled={isSubmitting} className="ibm-btn flex-1 flex justify-center items-center gap-2 text-base shadow-lg">
            <Save size={20} />
            {isSubmitting ? dict.loading : dict.update}
          </button>
        </div>
      </div>
    </form>
  )
}
