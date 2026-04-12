import Image from 'next/image'
import { Dictionary } from '@/i18n/dictionaries'
import { Image as ImageIcon } from 'lucide-react'

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    description: string
    pack_size: string
    image_url: string | null
  }
  dict: Dictionary
  currency: string
}

export default function ProductCard({ product, dict, currency }: ProductCardProps) {
  return (
    <div className="ibm-card rounded-none group hover:shadow-xl duration-300">
      <div className="relative h-64 w-full theme-bg-card border-b theme-border flex items-center justify-center p-4 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center theme-text-muted group-hover:text-ibm-blue transition-colors">
            <ImageIcon size={48} className="mb-2" />
            <span className="text-sm font-semibold">{dict.noImage}</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1 theme-bg">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-lg font-semibold theme-text line-clamp-1">{product.name}</h3>
          <span className="text-ibm-blue font-mono font-bold theme-bg-card px-2 py-1 shrink-0 text-sm border theme-border">
            {currency}{product.price}
          </span>
        </div>
        {product.pack_size && (
          <span className="text-xs theme-text-muted font-mono mb-3">{product.pack_size}</span>
        )}
        <p className="theme-text-muted text-sm line-clamp-3 flex-1">
          {product.description}
        </p>
      </div>
    </div>
  )
}
