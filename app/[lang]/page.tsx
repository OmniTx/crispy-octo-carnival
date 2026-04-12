import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { PackageX } from 'lucide-react'
import Image from 'next/image'

export const runtime = 'edge'
/** Avoid stale HTML at the edge after deploys or data changes (Vercel / Next cache). */
export const dynamic = 'force-dynamic'

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en
  const isBn = lang === 'bn'

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const currency = settings?.currency_symbol || '৳'

  const placeholderClass = `text-sm font-medium theme-text ${isBn ? 'font-bangla' : ''}`

  return (
    <div>
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold theme-text font-bangla">
          {isBn ? 'হার্বস পণ্যের সংক্ষিপ্ত বিবরণী ও মূল্য তালিকা' : 'Herbs Product Details & Price List'}
        </h1>
        <p className="theme-text-muted text-sm mt-2">{products?.length || 0} {dict.totalProducts}</p>
      </div>

      {!products || products.length === 0 ? (
        <div className="theme-text-muted flex flex-col items-center justify-center mt-20 text-lg border border-dashed theme-border p-20 theme-bg-card">
          <PackageX size={48} className="mb-4 opacity-30" />
          {dict.noProducts}
        </div>
      ) : (
        <div className="border theme-border theme-bg overflow-hidden rounded-none">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="text-left flex flex-col md:grid md:grid-cols-[minmax(0,0.2fr)_minmax(0,0.7fr)_minmax(0,0.1fr)] md:items-stretch border-b theme-border last:border-b-0"
            >
              {/* Left: product image (~20%) */}
              <div className="border-b md:border-b-0 md:border-r theme-border p-4 md:min-h-[11rem]">
                <div className="relative h-36 md:h-full md:min-h-[10rem] w-full bg-transparent">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-contain object-left" />
                  ) : (
                    <span className={`block pt-1 ${placeholderClass} theme-text-muted`}>{dict.productImagePlaceholder}</span>
                  )}
                </div>
              </div>

              {/* Middle: name + description + usage (~70%) */}
              <div className="flex flex-col min-h-0 border-b md:border-b-0 md:border-r theme-border">
                <div className="p-4 border-b theme-border">
                  <p className={`text-sm font-normal theme-text mb-2 ${isBn ? 'font-bangla' : ''}`}>
                    <span className="font-number">{String(index + 1).padStart(2, '0')}</span> {isBn ? 'পণ্যের নাম' : 'Product Name'}
                  </p>
                  <h2 className={`text-xl md:text-2xl font-bold theme-text leading-tight ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? (product.name_bn || product.name) : product.name}
                  </h2>
                </div>

                <div className="p-4 flex-1 space-y-5">
                  <div>
                    <p className={`text-sm font-bold theme-text mb-2 ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? 'বিবরণ' : 'Description'}
                    </p>
                    <p className={`text-sm font-normal theme-text leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? (product.description_bn || product.description) : product.description}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold theme-text mb-2 ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? 'সেবনবিধি' : 'Usage / Dosage'}
                    </p>
                    <p className={`text-sm font-normal theme-text leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? (product.usage_info_bn || product.usage_info || '-') : (product.usage_info || '-')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: pack size + price (~10%), stacked */}
              <div className={`p-4 flex flex-col justify-start gap-6 shrink-0 text-left ${isBn ? 'font-bangla' : ''}`}>
                <div>
                  <p className="text-sm font-bold theme-text mb-1">{isBn ? 'প্যাক সাইজ' : 'Pack Size'}</p>
                  <p className="text-sm font-normal theme-text font-number">{product.pack_size || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-bold theme-text mb-1">{isBn ? 'মূল্য' : 'Price'}</p>
                  <p className={`text-lg theme-text font-number tracking-tight`}>
                    {currency}
                    {product.price}/-
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
