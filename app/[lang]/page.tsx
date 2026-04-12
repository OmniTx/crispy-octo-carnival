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
        <div className="overflow-x-auto border theme-border shadow-xl">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead>
              <tr className="theme-table-header text-xs font-bold uppercase">
                <th className="px-3 py-4 text-center w-12 border-r border-blue-500/30">
                  {isBn ? 'ক্রমিক নং' : '#'}
                </th>
                <th className="px-4 py-4 border-r border-blue-500/30 min-w-[160px]">
                  {isBn ? 'পণ্যের নাম' : 'Product Name'}
                </th>
                <th className="px-4 py-4 border-r border-blue-500/30 min-w-[280px]">
                  {isBn ? 'সংক্ষিপ্ত কার্যকারিতা' : 'Description'}
                </th>
                <th className="px-4 py-4 border-r border-blue-500/30 min-w-[200px]">
                  {isBn ? 'সেবন/ব্যবহারবিধি' : 'Usage / Dosage'}
                </th>
                <th className="px-3 py-4 text-center border-r border-blue-500/30 w-24">
                  {isBn ? 'প্যাক সাইজ' : 'Pack Size'}
                </th>
                <th className="px-3 py-4 text-center w-20">
                  {isBn ? 'খুচরা মূল্য' : 'Price'}
                </th>
              </tr>
            </thead>
            <tbody className="font-bangla">
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b theme-border transition-colors theme-bg-hover ${
                    index % 2 === 0 ? 'theme-table-row-even' : 'theme-table-row-odd'
                  }`}
                >
                  {/* Serial Number */}
                  <td className="px-3 py-4 text-center font-mono font-bold theme-text-muted border-r theme-border">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Product Name */}
                  <td className="px-4 py-4 border-r theme-border">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold theme-text text-base leading-tight">
                        {isBn ? (product.name_bn || product.name) : product.name}
                      </span>
                      <span className="text-xs theme-text-muted italic">
                        {isBn ? product.name : (product.name_bn || '')}
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-4 border-r theme-border theme-text text-sm leading-relaxed">
                    {isBn ? (product.description_bn || product.description) : product.description}
                  </td>

                  {/* Usage */}
                  <td className="px-4 py-4 border-r theme-border theme-text-muted text-sm leading-relaxed">
                    {product.usage_info || '-'}
                  </td>

                  {/* Pack Size */}
                  <td className="px-3 py-4 text-center font-mono text-xs font-semibold theme-text border-r theme-border">
                    {product.pack_size || '-'}
                  </td>

                  {/* Price */}
                  <td className="px-3 py-4 text-center font-mono font-bold text-ibm-blue text-base">
                    {currency}{product.price}/-
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
