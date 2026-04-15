'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProduct, deleteImage, ActionState } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/i18n/dictionaries'
import { Save, Trash2 } from 'lucide-react'
import Image from 'next/image'

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
  pack_size_bn: string | null
  image_url: string | null
}

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="app-btn flex-1 flex justify-center items-center gap-2 text-base shadow-lg">
      <Save size={20} />
      {pending ? dict.loading : dict.update}
    </button>
  )
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
  const initialState: ActionState = { success: false, error: null }
  const [state, formAction] = useActionState(updateProduct, initialState)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (state.success) {
      router.push(`/${lang}/admin`)
    }
    if (state.error) {
      setErrorMsg(state.error)
      console.error('Update product error:', state.error)
    }
  }, [state, lang, router])

  const handleDeleteImage = async () => {
    if (!product.image_url) return

    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return
    }

    setIsDeletingImage(true)
    setErrorMsg('')
    try {
      await deleteImage(product.image_url)
      window.location.reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete image'
      setErrorMsg(message)
    } finally {
      setIsDeletingImage(false)
    }
  }

  return (
    <form action={formAction} className="max-w-3xl mx-auto border theme-border theme-bg p-8 shadow-2xl">
      {(state.error || errorMsg) && (
        <div className="mb-6 p-4 border border-red-600 text-red-500 bg-red-950/50 font-mono text-sm">{state.error || errorMsg}</div>
      )}

      <div className="space-y-6">
        <input type="hidden" name="id" value={product.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.name} (English)</label>
            <input type="text" name="name" defaultValue={product.name} required className="app-input" />
          </div>
          <div>
            <label className="app-label font-bangla">{dict.name} (বাংলা)</label>
            <input type="text" name="name_bn" defaultValue={product.name_bn ?? ''} className="app-input font-bangla" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.price}</label>
            <input type="number" step="0.01" name="price" defaultValue={product.price} required className="app-input font-mono" />
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.packSize} (English)</label>
            <input type="text" name="pack_size" defaultValue={product.pack_size ?? ''} placeholder="e.g. 200gm, 30 caps" className="app-input font-number" />
          </div>
          <div>
            <label className="app-label font-bangla">{dict.packSize} (বাংলা)</label>
            <input type="text" name="pack_size_bn" defaultValue={product.pack_size_bn ?? ''} placeholder="যেমন: ৩০০গ্রাম, ৩০ ক্যাপ" className="app-input font-bangla font-number" />
          </div>
        </div>

        <div>
          <label className="app-label">{dict.description} (English)</label>
          <textarea name="description" defaultValue={product.description ?? ''} rows={3} className="app-input" />
        </div>
        <div>
          <label className="app-label font-bangla">{dict.description} (বাংলা)</label>
          <textarea name="description_bn" defaultValue={product.description_bn ?? ''} rows={3} className="app-input font-bangla" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">Usage / Dosage (English)</label>
            <textarea name="usage_info" defaultValue={product.usage_info ?? ''} rows={2} className="app-input" />
          </div>
          <div>
            <label className="app-label font-bangla">সেবন/ব্যবহারবিধি (বাংলা)</label>
            <textarea name="usage_info_bn" defaultValue={product.usage_info_bn ?? ''} rows={2} className="app-input font-bangla" />
          </div>
        </div>

        <div>
          <label className="app-label">
            {dict.image} <span className="theme-text-muted font-normal ml-2">({dict.optional})</span>
          </label>
          {product.image_url ? (
            <div className="mb-3 space-y-3">
              <div className="relative h-32 w-32 border theme-border theme-bg-card">
                <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" />
              </div>
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isDeletingImage}
                className="app-btn-danger text-xs px-3 py-2 inline-flex items-center gap-1"
              >
                <Trash2 size={12} />
                {isDeletingImage ? 'Deleting...' : 'Delete Current Image'}
              </button>
            </div>
          ) : null}
          <div className="border border-dashed theme-border theme-bg-card p-4 transition-colors hover:border-brand-blue">
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:brightness-110 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push(`/${lang}/admin`)}
            className="app-btn theme-bg-card border theme-border theme-text flex-1 justify-center"
          >
            {dict.cancel}
          </button>
          <SubmitButton dict={dict} />
        </div>
      </div>
    </form>
  )
}
