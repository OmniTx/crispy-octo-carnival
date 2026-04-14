'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateSiteSettings, ActionState } from '@/lib/actions'
import { Dictionary } from '@/i18n/dictionaries'
import { Save, Check } from 'lucide-react'

type Settings = {
  site_name_en: string
  site_name_bn: string
  theme: string
  currency_symbol: string
}

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="app-btn flex items-center gap-2">
      <Save size={16} />
      {pending ? dict.loading : dict.saveSettings}
    </button>
  )
}

export default function AdminSettings({ settings, dict }: { settings: Settings; dict: Dictionary }) {
  const initialState: ActionState = { success: false, error: null }
  const [state, formAction] = useActionState(updateSiteSettings, initialState)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (state.success) {
      setSaved(true)
      const timer = setTimeout(() => setSaved(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [state.success])

  return (
    <form action={formAction} className="border theme-border theme-bg-card p-6 space-y-6">
      <h2 className="text-xl font-semibold theme-text">{dict.siteSettings}</h2>

      {state.error && <div className="p-3 border border-red-600 text-red-500 bg-red-950/50 text-sm font-mono">{state.error}</div>}
      {saved && <div className="p-3 border border-green-600 text-green-400 bg-green-950/50 text-sm font-semibold flex items-center gap-2"><Check size={16} /> {dict.saved}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="app-label">{dict.siteNameEn}</label>
          <input name="site_name_en" type="text" defaultValue={settings.site_name_en} className="app-input" />
        </div>
        <div>
          <label className="app-label">{dict.siteNameBn}</label>
          <input name="site_name_bn" type="text" defaultValue={settings.site_name_bn} className="app-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="app-label">{dict.theme}</label>
          <select name="theme" defaultValue={settings.theme} className="app-input">
            <option value="dark">{dict.dark}</option>
            <option value="light">{dict.light}</option>
          </select>
        </div>
        <div>
          <label className="app-label">{dict.currency}</label>
          <input name="currency_symbol" type="text" defaultValue={settings.currency_symbol} className="app-input w-24" />
        </div>
      </div>

      <SubmitButton dict={dict} />
    </form>
  )
}
