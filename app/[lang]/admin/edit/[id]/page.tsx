import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/EditProductForm'

export const runtime = 'edge'
export const revalidate = 60

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id } = await params
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const db = supabase()
  const { data: product, error } = await db.from('products').select('*').eq('id', id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light theme-text">{dict.editProduct}</h1>
      </div>

      <EditProductForm product={product} dict={dict} lang={lang} />
    </div>
  )
}
