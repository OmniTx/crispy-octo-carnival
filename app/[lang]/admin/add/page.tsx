import AddProductForm from '@/components/AddProductForm'
import { dictionaries, Locale } from '@/i18n/dictionaries'

export const runtime = 'edge'

export default async function AddPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = dictionaries[lang as Locale] || dictionaries.en

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light theme-text">{dict.addProduct}</h1>
      </div>

      <AddProductForm dict={dict} lang={lang} />
    </div>
  )
}

