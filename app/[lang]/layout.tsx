import '../globals.css'
import type { Metadata } from 'next'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { getSettings } from '@/lib/supabase'
import LanguageToggle from '@/components/LanguageToggle'
import HeaderAdminLink from '@/components/HeaderAdminLink'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Herbs Showcase',
  description: 'Premium Herbal Products Showcase',
  icons: {
    icon: '/favicon.png',
  },
}

export const revalidate = 60

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = dictionaries[lang as Locale] || dictionaries.en

  // Fetch site settings (cached)
  const { data: settings } = await getSettings()

  const defaultTheme = settings?.theme || 'dark'
  const siteName = lang === 'bn'
    ? (settings?.site_name_bn || dict.brandName)
    : (settings?.site_name_en || dict.brandName)

  return (
    <html lang={lang} className={defaultTheme}>
      <head>
        {/* Prevent FOUC: immediately apply theme from localStorage if present */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.className = theme;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <header className="border-b theme-border theme-bg-header p-4 flex justify-between items-center">
          <Link href={`/${lang}`} className={`font-semibold text-lg tracking-tight theme-text hover:text-brand-blue transition-colors ${lang === 'bn' ? 'font-bangla' : ''}`}>
            <span className="text-brand-blue mr-2">█</span>{siteName}
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle defaultTheme={defaultTheme} />
            <HeaderAdminLink lang={lang} dict={dict} />
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
