'use client'

import { useState, useEffect } from 'react'
import { listImages, deleteImage } from '@/lib/actions'
import { Trash2, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react'
import Image from 'next/image'

type ImageFile = {
  name: string
  created_at?: string | null
  updated_at?: string | null
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listImages()
      setImages(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleDelete = async (imageName: string) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(imageName)
    setError(null)
    try {
      await deleteImage(imageName)
      setImages((prev) => prev.filter((img) => img.name !== imageName))
      if (selectedImage === imageName) {
        setSelectedImage(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold theme-text">Image Library</h3>
        <button
          type="button"
          onClick={fetchImages}
          disabled={loading}
          className="app-btn text-xs px-3 py-2 inline-flex items-center gap-1 bg-brand-blue text-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-500/50 p-4 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <p>{error}</p>
        </div>
      )}

      {loading && images.length === 0 ? (
        <div className="text-center py-12 theme-text-muted">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
          <p>Loading images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 theme-text-muted border theme-border theme-bg-card">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
          <p>No images found in storage</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              className="relative group border theme-border theme-bg-card hover:border-brand-blue transition-all"
            >
              <div
                className="relative w-full aspect-square cursor-pointer"
                onClick={() => setSelectedImage(selectedImage === image.name ? null : image.name)}
              >
                <Image
                  src={image.name}
                  alt={image.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="p-2 border-t theme-border">
                <p className="text-xs theme-text-muted truncate" title={image.name}>
                  {image.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(image.name)
                  }}
                  disabled={deleting === image.name}
                  className="app-btn-danger text-xs w-full mt-2 px-2 py-1.5 inline-flex items-center justify-center gap-1"
                >
                  <Trash2 size={12} />
                  {deleting === image.name ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              {selectedImage === image.name && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-10">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.name}
                      alt={image.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs theme-text-muted">
        Total: {images.length} image{images.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
