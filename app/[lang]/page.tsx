import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import ProductCard from '@/components/ProductCard'
import { PackageX } from 'lucide-react'

export const runtime = 'edge'

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-end mb-10 pb-4 border-b border-ibm-gray800">
        <h1 className="text-4xl font-light tracking-tight">{dict.products}</h1>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-ibm-gray300 flex flex-col items-center justify-center mt-20 text-lg border border-dashed border-ibm-gray800 p-20 bg-ibm-gray900/30">
          <PackageX size={48} className="mb-4 text-ibm-gray800" />
          {dict.noProducts}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      )}
    </div>
  )
}
