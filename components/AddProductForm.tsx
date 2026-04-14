'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { addProduct, ActionState } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/i18n/dictionaries'
import { Plus } from 'lucide-react'

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="app-btn w-full flex justify-center items-center gap-2 text-base shadow-lg">
      <Plus size={20} />
      {pending ? dict.loading : dict.submit}
    </button>
  )
}

export default function AddProductForm({ dict, lang }: { dict: Dictionary; lang: string }) {
  const router = useRouter()
  const initialState: ActionState = { success: false, error: null }
  const [state, formAction] = useActionState(addProduct, initialState)

  useEffect(() => {
    if (state.success) {
      router.push(`/${lang}/admin`)
    }
  }, [state.success, lang, router])

  return (
    <form action={formAction} className="max-w-3xl mx-auto border theme-border theme-bg p-8 shadow-2xl">
      {state.error && <div className="mb-6 p-4 border border-red-600 text-red-500 bg-red-950/50 font-mono text-sm">{state.error}</div>}

      <div className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.name} (English)</label>
            <input type="text" name="name" required className="app-input" />
          </div>
          <div>
            <label className="app-label font-bangla">{dict.name} (বাংলা)</label>
            <input type="text" name="name_bn" className="app-input font-bangla" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.price}</label>
            <input type="number" step="0.01" name="price" required className="app-input font-mono" />
          </div>
          <div></div>
        </div>

        {/* Pack Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">{dict.packSize} (English)</label>
            <input type="text" name="pack_size" placeholder="e.g. 200gm, 30 caps" className="app-input font-number" />
          </div>
          <div>
            <label className="app-label font-bangla">{dict.packSize} (বাংলা)</label>
            <input type="text" name="pack_size_bn" placeholder="যেমন: ৩০০গ্রাম, ৩০ ক্যাপ" className="app-input font-bangla font-number" />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="app-label">{dict.description} (English)</label>
          <textarea name="description" rows={3} className="app-input" />
        </div>
        <div>
          <label className="app-label font-bangla">{dict.description} (বাংলা)</label>
          <textarea name="description_bn" rows={3} className="app-input font-bangla" />
        </div>

        {/* Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="app-label">Usage / Dosage (English)</label>
            <textarea name="usage_info" rows={2} className="app-input" />
          </div>
          <div>
            <label className="app-label font-bangla">সেবন/ব্যবহারবিধি (বাংলা)</label>
            <textarea name="usage_info_bn" rows={2} className="app-input font-bangla" />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="app-label">{dict.image} <span className="theme-text-muted font-normal ml-2">({dict.optional})</span></label>
          <div className="border border-dashed theme-border theme-bg-card p-4 transition-colors hover:border-brand-blue">
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:brightness-110 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton dict={dict} />
        </div>
      </div>
    </form>
  )
}
