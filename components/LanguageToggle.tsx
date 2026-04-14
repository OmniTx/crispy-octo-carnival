'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Locale } from '@/i18n/dictionaries'

export default function LanguageToggle({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const targetLang = currentLang === 'en' ? 'bn' : 'en'
  const label = currentLang === 'en' ? 'বাংলা' : 'English'

  // Replace the language segment in the pathname
  // e.g., /en/admin?tab=settings -> /bn/admin?tab=settings
  const segments = pathname.split('/')
  segments[1] = targetLang
  const newPath = segments.join('/')
  
  // Preserve search params
  const queryString = searchParams.toString()
  const href = queryString ? `${newPath}?${queryString}` : newPath

  return (
    <Link 
      href={href} 
      className="text-ibm-gray300 hover:text-ibm-white text-sm font-semibold transition-colors"
    >
      {label}
    </Link>
  )
}
