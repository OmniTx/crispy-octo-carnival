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
  const siteName = isBn
    ? (settings?.site_name_bn || dict.brandName)
    : (settings?.site_name_en || dict.brandName)

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
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id} className="border theme-border theme-bg flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
              
              {/* Left Column: Image */}
              <div className="border-b md:border-b-0 md:border-r theme-border p-4 w-full md:w-[200px] flex items-center justify-center shrink-0 theme-bg-card">
                {product.image_url ? (
                  <div className="relative w-32 h-32">
                    <Image src={product.image_url} alt={product.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-32 h-32 border theme-border flex items-center justify-center bg-transparent">
                    <span className="text-xs theme-text-muted">Product image</span>
                  </div>
                )}
              </div>

              {/* Middle Column: Details */}
              <div className="flex flex-col flex-1 border-b md:border-b-0 md:border-r theme-border">
                {/* Top Half */}
                <div className="p-4 border-b theme-border">
                  <div className="flex gap-2 items-center text-sm theme-text-muted mb-1">
                    <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
                    <span>{isBn ? 'পণ্যের নাম / Product Name' : 'Product Name'}</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold theme-text font-bangla">
                    {isBn ? (product.name_bn || product.name) : product.name}
                  </div>
                  {isBn && product.name_bn && (
                    <div className="text-xs theme-text-muted italic mt-1">{product.name}</div>
                  )}
                </div>
                
                {/* Bottom Half */}
                <div className="p-4 flex-1">
                  <div className="text-sm font-semibold mb-1 theme-text">{isBn ? 'বিবরণ / Description' : 'Description'}</div>
                  <div className="text-sm theme-text-muted font-bangla leading-relaxed mb-4">
                    {isBn ? (product.description_bn || product.description) : product.description}
                  </div>
                  
                  <div className="text-sm font-semibold mb-1 theme-text">{isBn ? 'সেবনবিধি / Usage' : 'Usage / Dosage'}</div>
                  <div className="text-sm theme-text-muted font-bangla leading-relaxed">
                    {product.usage_info || '-'}
                  </div>
                </div>
              </div>

              {/* Right Column: Meta */}
              <div className="p-4 w-full md:w-[200px] flex flex-row md:flex-col justify-around md:justify-center gap-6 shrink-0 bg-transparent">
                <div>
                  <div className="text-sm theme-text mb-1">{isBn ? 'প্যাক সাইজ / Pack Size' : 'Pack Size'}</div>
                  <div className="theme-text-muted text-sm font-mono">{product.pack_size || '-'}</div>
                </div>
                <div>
                  <div className="text-sm theme-text mb-1">{isBn ? 'মূল্য / Price' : 'Price'}</div>
                  <div className="text-lg font-bold text-ibm-blue font-mono">{currency}{product.price}/-</div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
