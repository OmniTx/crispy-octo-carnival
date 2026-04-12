import AddProductForm from '@/components/AddProductForm'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const runtime = 'edge'

export default function AddPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/${lang}`} className="text-ibm-blue hover:text-white flex items-center gap-2 w-fit mb-6 transition-colors">
          <ArrowLeft size={16} />
          All {dict.products}
        </Link>
        <h1 className="text-3xl font-light">{dict.addProduct}</h1>
      </div>
      
      <AddProductForm dict={dict} lang={lang} />
    </div>
  )
}
