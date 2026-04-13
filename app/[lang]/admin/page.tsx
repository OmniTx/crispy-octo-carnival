import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import Link from 'next/link'
import { Plus, ArrowLeft, Package, Settings as SettingsIcon, ArrowUpDown } from 'lucide-react'
import AdminProductTable from '@/components/AdminProductTable'
import AdminSettings from '@/components/AdminSettings'
import ImportExport from '@/components/ImportExport'

export const runtime = 'edge'
export const revalidate = 60

async function fetchAdminData() {
  const db = supabase()
  
  const [productsResult, settingsResult] = await Promise.all([
    db.from('products').select('*').order('sort_order', { ascending: true }),
    db.from('site_settings').select('*').eq('id', 1).single(),
  ])

  return {
    products: productsResult.data,
    settings: settingsResult.data,
  }
}

export default async function AdminPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const { products, settings } = await fetchAdminData()
  const currency = settings?.currency_symbol || '৳'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href={`/${lang}`} className="theme-text-muted hover:text-ibm-blue flex items-center gap-2 w-fit mb-4 transition-colors text-sm">
          <ArrowLeft size={14} />
          {dict.backToSite}
        </Link>
        <div className="flex justify-between items-center pb-4 border-b theme-border">
          <h1 className="text-3xl font-light theme-text">{dict.adminPanel}</h1>
          <Link href={`/${lang}/add`} className="ibm-btn flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            <span>{dict.addProduct}</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border theme-border theme-bg-card p-5 flex items-center gap-4">
          <Package size={24} className="text-ibm-blue" />
          <div>
            <div className="text-2xl font-bold theme-text">{products?.length || 0}</div>
            <div className="text-xs theme-text-muted uppercase tracking-wider">{dict.totalProducts}</div>
          </div>
        </div>
        <div className="border theme-border theme-bg-card p-5 flex items-center gap-4">
          <SettingsIcon size={24} className="text-ibm-blue" />
          <div>
            <div className="text-2xl font-bold theme-text">{settings?.theme || 'dark'}</div>
            <div className="text-xs theme-text-muted uppercase tracking-wider">{dict.theme}</div>
          </div>
        </div>
        <div className="border theme-border theme-bg-card p-5 flex items-center gap-4">
          <ArrowUpDown size={24} className="text-ibm-blue" />
          <div>
            <div className="text-2xl font-bold theme-text">{currency}</div>
            <div className="text-xs theme-text-muted uppercase tracking-wider">{dict.currency}</div>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      {settings && (
        <AdminSettings
          settings={{
            site_name_en: settings.site_name_en,
            site_name_bn: settings.site_name_bn,
            theme: settings.theme,
            currency_symbol: settings.currency_symbol,
          }}
          dict={dict}
        />
      )}

      {/* Import / Export */}
      <ImportExport products={products || []} dict={dict} />

      {/* Products Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold theme-text flex items-center gap-2">
          <Package size={20} /> {dict.allProducts} ({products?.length || 0})
        </h2>
        <AdminProductTable products={products || []} dict={dict} lang={lang} currency={currency} />
      </div>
    </div>
  )
}
