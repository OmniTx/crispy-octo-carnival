import Image from 'next/image'
import { Dictionary } from '@/i18n/dictionaries'
import { Image as ImageIcon } from 'lucide-react'

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    description: string
    image_url: string | null
  }
  dict: Dictionary
}

export default function ProductCard({ product, dict }: ProductCardProps) {
  return (
    <div className="ibm-card rounded-none group hover:shadow-xl duration-300">
      <div className="relative h-64 w-full bg-ibm-gray900 border-b border-ibm-gray800 flex items-center justify-center p-4 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-ibm-gray800 group-hover:text-ibm-gray300 transition-colors">
            <ImageIcon size={48} className="mb-2" />
            <span className="text-sm font-semibold">{dict.noImage}</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1 bg-ibm-black">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-semibold text-ibm-white line-clamp-1">{product.name}</h3>
          <span className="text-ibm-blue font-mono font-bold bg-ibm-gray900 px-2 py-1 shrink-0">${product.price}</span>
        </div>
        <p className="text-ibm-gray300 text-sm line-clamp-3 mb-4 flex-1">
          {product.description}
        </p>
      </div>
    </div>
  )
}
