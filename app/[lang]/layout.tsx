import '../globals.css'
import type { Metadata } from 'next'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { supabase } from '@/lib/supabase'
import LanguageToggle from '@/components/LanguageToggle'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Herbs Showcase',
  description: 'Premium Herbal Products Showcase',
  icons: {
    icon: '/favicon.png',
  },
}

export const dynamic = 'force-dynamic'

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

  // Check for admin session via cookies (Supabase default)
  const cookieStore = cookies()
  const hasSession = cookieStore.get('sb-access-token') || cookieStore.get('sb-refresh-token')

  return (
    <html lang={lang} className={theme}>
      <body>
        <header className="border-b theme-border theme-bg-header p-4 flex justify-between items-center">
          <Link href={`/${lang}`} className="font-semibold text-lg tracking-tight theme-text hover:text-ibm-blue transition-colors">
            <span className="text-ibm-blue mr-2">█</span>{siteName}
          </Link>
          <div className="flex items-center gap-4">
            {hasSession && (
              <Link
                href={`/${lang}/admin`}
                className="theme-text-muted hover:text-ibm-blue transition-colors"
                title={dict.adminPanel}
              >
                <Settings size={18} />
              </Link>
            )}
            <LanguageToggle currentLang={lang as Locale} />
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
        {process.env.VERCEL ? (
          <footer className="border-t theme-border theme-bg-header px-4 py-2">
            <p
              className="text-center text-[10px] font-mono theme-text-muted opacity-70"
              title="If this SHA does not match your latest GitHub commit, Production may be pinned to an old deploy or you are on a different URL/project."
            >
              {process.env.VERCEL_ENV ?? 'vercel'} ·{' '}
              {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '—'}
            </p>
          </footer>
        ) : null}
      </body>
    </html>
  )
}
