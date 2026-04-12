import Link from 'next/link'
import { Locale } from '@/i18n/dictionaries'

export default function LanguageToggle({ currentLang }: { currentLang: Locale }) {
  const targetLang = currentLang === 'en' ? 'bn' : 'en'
  const label = currentLang === 'en' ? 'বাংলা' : 'English'

  return (
    <Link 
      href={`/${targetLang}`} 
      className="text-ibm-gray300 hover:text-ibm-white text-sm font-semibold transition-colors"
    >
      {label}
    </Link>
  )
}
