'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProduct } from '@/lib/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/i18n/dictionaries'
import { Plus } from 'lucide-react'

// Schema matches server validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  description: z.string().optional(),
})

type FormData = z.infer<typeof productSchema>

export default function AddProductForm({ dict, lang }: { dict: Dictionary, lang: string }) {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('price', data.price.toString())
      formData.append('description', data.description || '')
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await addProduct(formData)
      router.push(`/${lang}`)
    } catch (error: any) {
      setErrorMsg(error.message || dict.error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto border border-ibm-gray800 bg-ibm-black p-8 shadow-2xl">
      {errorMsg && <div className="mb-6 p-4 border border-red-600 text-red-500 bg-red-950 font-mono text-sm">{errorMsg}</div>}
      
      <div className="space-y-6">
        <div>
          <label className="ibm-label">{dict.name}</label>
          <input type="text" {...register('name')} className="ibm-input" />
          {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message as string}</p>}
        </div>

        <div>
           <label className="ibm-label">{dict.price}</label>
          <input type="number" step="0.01" {...register('price')} className="ibm-input font-mono" />
          {errors.price && <p className="text-red-500 text-sm mt-2 font-medium">{errors.price.message as string}</p>}
        </div>

        <div>
          <label className="ibm-label">{dict.description}</label>
          <textarea {...register('description')} rows={4} className="ibm-input" />
        </div>

        <div>
           <label className="ibm-label">{dict.image} <span className="text-ibm-gray300 font-normal ml-2">({dict.optional})</span></label>
          <div className="border border-dashed border-ibm-gray800 bg-ibm-gray900 p-4 transition-colors hover:border-ibm-gray300">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-ibm-gray300 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-ibm-gray800 file:text-white hover:file:bg-ibm-blue hover:file:text-white transition-all cursor-pointer" 
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
