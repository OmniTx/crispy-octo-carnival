import { dictionaries, Locale } from '@/i18n/dictionaries'
import AdminSidebar from '@/components/AdminSidebar'

export const runtime = 'edge'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = dictionaries[lang as Locale] || dictionaries.en

  return (
    <div className="flex flex-col md:flex-row min-h-screen theme-bg">
      <AdminSidebar lang={lang} dict={dict} />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
