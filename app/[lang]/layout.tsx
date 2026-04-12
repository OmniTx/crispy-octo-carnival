import '../globals.css'
import type { Metadata } from 'next'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import LanguageToggle from '@/components/LanguageToggle'

export const metadata: Metadata = {
  title: 'IBM Showcase',
  description: 'Enterprise Product Showcase',
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dict = dictionaries[lang as Locale] || dictionaries.en

  return (
    <html lang={lang}>
      <body>
        <header className="border-b border-ibm-gray800 bg-ibm-black p-4 flex justify-between items-center">
          <div className="font-semibold text-lg tracking-tight">
            <span className="text-ibm-blue mr-2">█</span>{dict.brandName}
          </div>
          <LanguageToggle currentLang={lang} />
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
