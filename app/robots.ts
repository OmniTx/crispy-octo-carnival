import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/*/admin/', '/login/', '/*/login/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://herbs-showcase.vercel.app'}/sitemap.xml`,
  }
}
