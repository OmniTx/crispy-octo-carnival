'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProduct } from '@/lib/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/i18n/dictionaries'
import { Plus } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  description: z.string().optional(),
  pack_size: z.string().optional(),
})

type FormValues = z.infer<typeof productSchema>

export default function AddProductForm({ dict, lang }: { dict: Dictionary; lang: string }) {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('price', data.price.toString())
      formData.append('description', data.description || '')
      formData.append('pack_size', data.pack_size || '')
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await addProduct(formData)
      router.push(`/${lang}/admin`)
    } catch (error: any) {
      setErrorMsg(error.message || dict.error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto border theme-border theme-bg p-8 shadow-2xl">
      {errorMsg && <div className="mb-6 p-4 border border-red-600 text-red-500 bg-red-950/50 font-mono text-sm">{errorMsg}</div>}

      <div className="space-y-6">
        <div>
          <label className="ibm-label">{dict.name}</label>
          <input type="text" {...register('name')} className="ibm-input" />
          {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="ibm-label">{dict.price}</label>
            <input type="number" step="0.01" {...register('price')} className="ibm-input font-mono" />
            {errors.price && <p className="text-red-500 text-sm mt-2 font-medium">{errors.price.message as string}</p>}
          </div>
          <div>
            <label className="ibm-label">{dict.packSize}</label>
            <input type="text" {...register('pack_size')} placeholder="e.g. 200gm, 30 caps" className="ibm-input" />
          </div>
        </div>

        <div>
          <label className="ibm-label">{dict.description}</label>
          <textarea {...register('description')} rows={4} className="ibm-input" />
        </div>

        <div>
          <label className="ibm-label">{dict.image} <span className="theme-text-muted font-normal ml-2">({dict.optional})</span></label>
          <div className="border border-dashed theme-border theme-bg-card p-4 transition-colors hover:border-ibm-blue">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-ibm-blue file:text-white hover:file:brightness-110 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="ibm-btn w-full flex justify-center items-center gap-2 text-base shadow-lg">
            <Plus size={20} />
            {isSubmitting ? dict.loading : dict.submit}
          </button>
        </div>
      </div>
    </form>
  )
}
