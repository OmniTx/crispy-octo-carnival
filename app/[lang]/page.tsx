import { supabase } from '@/lib/supabase'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { PackageX } from 'lucide-react'
import Image from 'next/image'

export const runtime = 'edge'

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
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="border theme-border theme-bg bg-transparent flex flex-col md:grid md:grid-cols-[minmax(0,0.2fr)_minmax(0,0.65fr)_minmax(0,0.15fr)] md:items-stretch"
            >
              {/* Left: image (~20%) */}
              <div className="border-b md:border-b-0 md:border-r theme-border p-4 flex items-center justify-center min-h-[140px] md:min-h-0">
                <div className="relative w-full min-h-[120px] md:min-h-[160px] border theme-border flex items-center justify-center bg-transparent p-2">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" />
                  ) : (
                    <span className={placeholderClass}>{dict.productImagePlaceholder}</span>
                  )}
                </div>
              </div>

              {/* Middle: details (~65%) */}
              <div className="flex flex-col min-h-0 border-b md:border-b-0 md:border-r theme-border">
                <div className="p-4 border-b theme-border flex flex-col justify-end min-h-[100px]">
                  <div className={`flex gap-2 items-center text-sm theme-text mb-1 ${isBn ? 'font-bangla' : ''}`}>
                    <span className="font-medium">{String(index + 1).padStart(2, '0')}</span>
                    <span>{isBn ? 'পণ্যের নাম' : 'Product Name'}</span>
                  </div>
                  <div className={`text-xl md:text-2xl font-semibold theme-text ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? (product.name_bn || product.name) : product.name}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className={`text-sm font-semibold theme-text mb-1 ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? 'বিবরণ' : 'Description'}
                  </div>
                  <div className={`text-sm theme-text leading-relaxed mb-4 ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? (product.description_bn || product.description) : product.description}
                  </div>

                  <div className={`text-sm font-semibold theme-text mb-1 ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? 'সেবনবিধি' : 'Usage / Dosage'}
                  </div>
                  <div className={`text-sm theme-text leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                    {product.usage_info || '-'}
                  </div>
                </div>
              </div>

              {/* Right: pack & price (~15%) */}
              <div
                className={`p-4 flex flex-row md:flex-col justify-start gap-8 shrink-0 ${isBn ? 'font-bangla' : ''}`}
              >
                <div>
                  <div className="text-sm font-semibold theme-text mb-1">{isBn ? 'প্যাক সাইজ' : 'Pack Size'}</div>
                  <div className="theme-text text-sm">{product.pack_size || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold theme-text mb-1">{isBn ? 'মূল্য' : 'Price'}</div>
                  <div className="text-lg theme-text font-bangla">{currency}{product.price}/-</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
