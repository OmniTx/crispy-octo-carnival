import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://herbs-showcase.vercel.app'
  const locales = ['en', 'bn']
  
  // Static routes
  const staticRoutes = locales.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }))

  // Dynamic products
  try {
    const { data: products } = await getProducts()
    
    if (products && products.length > 0) {
      const productRoutes = locales.flatMap((lang) => 
        products.map((p: any) => ({
          url: `${baseUrl}/${lang}`, // All products are displayed on the main page currentlty
          lastModified: new Date(p.updated_at || p.created_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      )
      // Filter out duplicate main page URLs from products mapping (since they share one URL)
      const uniqueProductRoutes = productRoutes.slice(0, locales.length)
      return [...staticRoutes] // Currenly the app is single page per lang
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return [...staticRoutes]
}
