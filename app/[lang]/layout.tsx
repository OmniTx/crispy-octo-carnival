import '../globals.css'
import type { Metadata } from 'next'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { supabase } from '@/lib/supabase'
import LanguageToggle from '@/components/LanguageToggle'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Herbs Showcase',
  description: 'Premium Herbal Products Showcase',
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  // Fetch site settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const theme = settings?.theme || 'dark'
  const siteName = lang === 'bn'
    ? (settings?.site_name_bn || dict.brandName)
    : (settings?.site_name_en || dict.brandName)

  return (
    <html lang={lang} className={theme}>
      <body>
        <header className="border-b theme-border theme-bg-header p-4 flex justify-between items-center">
          <Link href={`/${lang}`} className="font-semibold text-lg tracking-tight theme-text hover:text-ibm-blue transition-colors">
            <span className="text-ibm-blue mr-2">█</span>{siteName}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/admin`}
              className="theme-text-muted hover:text-ibm-blue transition-colors"
              title={dict.adminPanel}
            >
              <Settings size={18} />
            </Link>
            <LanguageToggle currentLang={lang as Locale} />
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
