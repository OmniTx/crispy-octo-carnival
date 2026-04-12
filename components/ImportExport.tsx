'use client'

import { useState, useRef } from 'react'
import { bulkImportProducts } from '@/lib/actions'
import { productsToCSV, parseCSV } from '@/lib/csv'
import { Dictionary } from '@/i18n/dictionaries'
import { Download, Upload, Check, AlertCircle } from 'lucide-react'

type Product = {
  id: string
  name: string
  price: number
  description: string
  pack_size: string
  image_url: string | null
}

export default function ImportExport({ products, dict }: { products: Product[]; dict: Dictionary }) {
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const csv = productsToCSV(products)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setError('')
    setMessage('')

    try {
      const text = await file.text()
      const parsed = parseCSV(text)

      if (parsed.length === 0) {
        throw new Error('No valid products found in CSV')
      }

      const result = await bulkImportProducts(parsed)
      setMessage(`${result.count} ${dict.imported}`)
    } catch (err: any) {
      setError(err.message || dict.error)
    } finally {
      setIsImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="border theme-border theme-bg-card p-6 space-y-6">
      <h2 className="text-xl font-semibold theme-text">{dict.importExport}</h2>

      {error && (
        <div className="p-3 border border-red-600 text-red-500 bg-red-950/50 text-sm font-mono flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {message && (
        <div className="p-3 border border-green-600 text-green-400 bg-green-950/50 text-sm font-semibold flex items-center gap-2">
          <Check size={16} /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="border theme-border p-6 space-y-4">
          <h3 className="font-semibold theme-text">{dict.exportCSV}</h3>
          <p className="theme-text-muted text-sm">{dict.totalProducts}: {products.length}</p>
          <button onClick={handleExport} className="ibm-btn flex items-center gap-2 w-full justify-center">
            <Download size={16} />
            {dict.exportCSV}
          </button>
        </div>

        {/* Import */}
        <div className="border theme-border p-6 space-y-4">
          <h3 className="font-semibold theme-text">{dict.importCSV}</h3>
          <p className="theme-text-muted text-sm">{dict.importHelp}</p>
          <label className="ibm-btn flex items-center gap-2 w-full justify-center cursor-pointer">
            <Upload size={16} />
            {isImporting ? dict.importing : dict.importCSV}
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
