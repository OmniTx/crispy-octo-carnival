'use client'

import { deleteProduct } from '@/lib/actions'
import { Dictionary } from '@/i18n/dictionaries'
import { useState } from 'react'
import { Trash2, Image as ImageIcon, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  description: string
  pack_size: string
  image_url: string | null
}

export default function AdminProductTable({ products, dict, lang, currency }: { products: Product[]; dict: Dictionary; lang: string; currency: string }) {
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
    <div className="overflow-x-auto border theme-border theme-bg shadow-2xl">
      <table className="w-full text-left text-sm theme-text">
        <thead className="theme-bg-card text-xs uppercase border-b theme-border">
          <tr>
            <th className="px-4 py-4 w-16">#</th>
            <th className="px-4 py-4 w-16">{dict.image}</th>
            <th className="px-4 py-4">{dict.name}</th>
            <th className="px-4 py-4">{dict.packSize}</th>
            <th className="px-4 py-4">{dict.price}</th>
            <th className="px-4 py-4 w-40 text-right">{dict.actions}</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center theme-text-muted border-t theme-border">
                {dict.noProducts}
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id} className="border-b theme-border theme-bg-hover transition-colors">
                <td className="px-4 py-3 theme-text-muted text-xs font-number">{index + 1}</td>
                <td className="px-4 py-3">
                  {product.image_url ? (
                    <div className="relative w-10 h-10 theme-bg-card border theme-border flex items-center justify-center">
                      <Image src={product.image_url} alt={product.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 theme-bg-card flex items-center justify-center theme-text-muted border theme-border">
                      <ImageIcon size={14} />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold theme-text">{product.name}</td>
                <td className="px-4 py-3 theme-text-muted text-xs font-number">{product.pack_size || '-'}</td>
                <td className="px-4 py-3 font-number text-ibm-blue">{currency}{product.price}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/${lang}/admin/edit/${product.id}`}
                      className="ibm-btn text-xs px-3 py-2 inline-flex items-center gap-1 theme-bg-card border theme-border"
                    >
                      <Pencil size={12} />
                      {dict.editProduct}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id, product.image_url)}
                      disabled={deletingId === product.id}
                      className="ibm-btn-danger text-xs px-3 py-2 inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      {deletingId === product.id ? '...' : dict.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
