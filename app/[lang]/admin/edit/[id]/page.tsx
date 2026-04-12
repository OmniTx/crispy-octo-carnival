import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/EditProductForm'

export const runtime = 'edge'

export default async function EditProductPage({
  params: { lang, id },
}: {
  params: { lang: string; id: string }
}) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/${lang}/admin`}
          className="text-ibm-blue hover:theme-text flex items-center gap-2 w-fit mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {dict.adminPanel}
        </Link>
        <h1 className="text-3xl font-light theme-text">{dict.editProduct}</h1>
      </div>

      <EditProductForm product={product} dict={dict} lang={lang} />
    </div>
  )
}
