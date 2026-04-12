'use client'

import { deleteProduct } from '@/lib/actions'
import { Dictionary } from '@/i18n/dictionaries'
import { useState } from 'react'
import { Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  price: number
  description: string
  image_url: string | null
}

export default function AdminProductTable({ products, dict, lang }: { products: Product[], dict: Dictionary, lang: string }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, imageUrl: string | null) => {
    setDeletingId(id)
    try {
      await deleteProduct(id, imageUrl || '')
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="overflow-x-auto border border-ibm-gray800 bg-ibm-black shadow-2xl">
      <table className="w-full text-left text-sm text-ibm-gray100">
        <thead className="bg-ibm-gray900 text-xs uppercase border-b border-ibm-gray800">
          <tr>
            <th className="px-6 py-4">{dict.image}</th>
            <th className="px-6 py-4">{dict.name}</th>
            <th className="px-6 py-4">{dict.price}</th>
            <th className="px-6 py-4 w-40 text-right">{dict.actions}</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-ibm-gray300 border-t border-ibm-gray800">
                {dict.noProducts}
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-b border-ibm-gray800 hover:bg-ibm-gray900 transition-colors">
                <td className="px-6 py-4 w-24">
                  {product.image_url ? (
                    <div className="relative w-16 h-16 bg-ibm-black border border-ibm-gray800 flex items-center justify-center p-1">
                      <Image src={product.image_url} alt={product.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-ibm-gray800 flex items-center justify-center text-ibm-gray300">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-ibm-white text-base">
                  {product.name}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-ibm-blue text-base">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(product.id, product.image_url)}
                    disabled={deletingId === product.id}
                    className="ibm-btn-danger text-xs px-3 py-2 inline-flex items-center justify-center gap-2 w-full text-center"
                  >
                    <Trash2 size={14} />
                    {deletingId === product.id ? dict.loading : dict.delete}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
