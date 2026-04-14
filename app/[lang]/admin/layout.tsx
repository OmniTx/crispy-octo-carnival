import { dictionaries, Locale } from '@/i18n/dictionaries'
import AdminSidebar from '@/components/AdminSidebar'

export const runtime = 'edge'

export default function AdminLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
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
