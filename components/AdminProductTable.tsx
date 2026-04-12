'use client'

import { deleteProduct, reorderProducts } from '@/lib/actions'
import { Dictionary } from '@/i18n/dictionaries'
import { useState, useRef, useCallback } from 'react'
import { Trash2, Image as ImageIcon, Pencil, GripVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  description: string
  pack_size: string
  pack_size_bn?: string | null
  image_url: string | null
  sort_order?: number
}

export default function AdminProductTable({ products: initialProducts, dict, lang, currency }: { products: Product[]; dict: Dictionary; lang: string; currency: string }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Drag state
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const handleDelete = async (id: string, imageUrl: string | null) => {
    setDeletingId(id)
    try {
      await deleteProduct(id, imageUrl || '')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index
    setDragIndex(index)
  }, [])

  const handleDragEnter = useCallback((index: number) => {
    dragOverItem.current = index
    setOverIndex(index)
  }, [])

  const handleDragEnd = useCallback(async () => {
    const from = dragItem.current
    const to = dragOverItem.current
    setDragIndex(null)
    setOverIndex(null)
    dragItem.current = null
    dragOverItem.current = null

    if (from === null || to === null || from === to) return

    // Reorder locally
    const reordered = [...products]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setProducts(reordered)

    // Persist to DB
    setSaving(true)
    try {
      await reorderProducts(reordered.map((p) => p.id))
    } catch (err) {
      console.error(err)
      // Revert on failure
      setProducts(products)
    } finally {
      setSaving(false)
    }
  }, [products])

  return (
    <div className="space-y-2">
      {saving && (
        <div className="text-xs text-ibm-blue font-medium animate-pulse">
          {dict.loading || 'Saving order...'}
        </div>
      )}
      <div className="overflow-x-auto border theme-border theme-bg shadow-2xl">
        <table className="w-full text-left text-sm theme-text">
          <thead className="theme-bg-card text-xs uppercase border-b theme-border">
            <tr>
              <th className="px-2 py-4 w-10"></th>
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
                <td colSpan={7} className="px-6 py-8 text-center theme-text-muted border-t theme-border">
                  {dict.noProducts}
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border-b theme-border transition-all cursor-grab active:cursor-grabbing ${
                    dragIndex === index
                      ? 'opacity-40 bg-ibm-blue/10'
                      : overIndex === index && dragIndex !== null
                      ? 'border-t-2 border-t-ibm-blue'
                      : 'theme-bg-hover'
                  }`}
                >
                  <td className="px-2 py-3 text-center">
                    <GripVertical size={16} className="theme-text-muted inline-block" />
                  </td>
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
                  <td className="px-4 py-3 theme-text-muted text-xs font-number">{lang === 'bn' ? (product.pack_size_bn || product.pack_size || '-') : (product.pack_size || '-')}</td>
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
    </div>
  )
}
