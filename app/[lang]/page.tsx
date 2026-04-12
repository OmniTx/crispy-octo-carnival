import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import ProductCard from '@/components/ProductCard'
import { PackageX } from 'lucide-react'

export const runtime = 'edge'

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: settings } = await supabase
    .from('site_settings')
    .select('currency_symbol')
    .eq('id', 1)
    .single()

  const currency = settings?.currency_symbol || '৳'

  return (
    <div>
      <div className="flex justify-between items-end mb-10 pb-4 border-b theme-border">
        <div>
          <h1 className="text-4xl font-light tracking-tight theme-text">{dict.products}</h1>
          <p className="theme-text-muted text-sm mt-1">{products?.length || 0} {dict.totalProducts}</p>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="theme-text-muted flex flex-col items-center justify-center mt-20 text-lg border border-dashed theme-border p-20 theme-bg-card">
          <PackageX size={48} className="mb-4 opacity-30" />
          {dict.noProducts}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} dict={dict} currency={currency} />
          ))}
        </div>
      )}
    </div>
  )
}
