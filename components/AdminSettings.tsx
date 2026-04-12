'use client'

import { useState } from 'react'
import { updateSiteSettings } from '@/lib/actions'
import { Dictionary } from '@/i18n/dictionaries'
import { Save, Check } from 'lucide-react'

type Settings = {
  site_name_en: string
  site_name_bn: string
  theme: string
  currency_symbol: string
}

export default function AdminSettings({ settings, dict }: { settings: Settings; dict: Dictionary }) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSaved(false)

    try {
      const formData = new FormData(e.currentTarget)
      await updateSiteSettings(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || dict.error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border theme-border theme-bg-card p-6 space-y-6">
      <h2 className="text-xl font-semibold theme-text">{dict.settings}</h2>

      {error && <div className="p-3 border border-red-600 text-red-500 bg-red-950/50 text-sm font-mono">{error}</div>}
      {saved && <div className="p-3 border border-green-600 text-green-400 bg-green-950/50 text-sm font-semibold flex items-center gap-2"><Check size={16} /> {dict.saved}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="ibm-label">{dict.siteNameEn}</label>
          <input name="site_name_en" type="text" defaultValue={settings.site_name_en} className="ibm-input" />
        </div>
        <div>
          <label className="ibm-label">{dict.siteNameBn}</label>
          <input name="site_name_bn" type="text" defaultValue={settings.site_name_bn} className="ibm-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="ibm-label">{dict.theme}</label>
          <select name="theme" defaultValue={settings.theme} className="ibm-input">
            <option value="dark">{dict.dark}</option>
            <option value="light">{dict.light}</option>
          </select>
        </div>
        <div>
          <label className="ibm-label">{dict.currency}</label>
          <input name="currency_symbol" type="text" defaultValue={settings.currency_symbol} className="ibm-input w-24" />
        </div>
      </div>

      <button type="submit" disabled={isSaving} className="ibm-btn flex items-center gap-2">
        <Save size={16} />
        {isSaving ? dict.loading : dict.saveSettings}
      </button>
    </form>
  )
}
