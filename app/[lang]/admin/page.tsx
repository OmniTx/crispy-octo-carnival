import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import AdminProductTable from '@/components/AdminProductTable'

export const runtime = 'edge'

export default async function AdminPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href={`/${lang}`} className="text-ibm-gray300 hover:text-white flex items-center gap-2 w-fit mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to {dict.products}
        </Link>
        <div className="flex justify-between items-center pb-4 border-b border-ibm-gray800">
          <h1 className="text-3xl font-light">{dict.adminPanel} - {dict.manageProducts}</h1>
          <Link href={`/${lang}/add`} className="ibm-btn flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            <span>{dict.addProduct}</span>
          </Link>
        </div>
      </div>

      <AdminProductTable products={products || []} dict={dict} lang={lang} />
    </div>
  )
}
