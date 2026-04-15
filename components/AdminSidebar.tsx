'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Settings, Image as ImageIcon, FileUp, Menu, X, ArrowLeft, Users } from 'lucide-react'

export default function AdminSidebar({ lang, dict }: { lang: string, dict: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'

  const links = [
    { name: dict.dashboard || 'Dashboard', href: `/${lang}/admin?tab=dashboard`, icon: LayoutDashboard, tab: 'dashboard', exact: true },
    { name: dict.addProduct || 'Add Product', href: `/${lang}/admin/add`, icon: PlusCircle, tab: 'add' },
    { name: dict.siteSettings || 'Site Settings', href: `/${lang}/admin?tab=settings`, icon: Settings, tab: 'settings' },
    { name: dict.imageLibrary || 'Image Library', href: `/${lang}/admin?tab=images`, icon: ImageIcon, tab: 'images' },
    { name: dict.importExport || 'Import/Export', href: `/${lang}/admin?tab=import`, icon: FileUp, tab: 'import' },
  ]

  const isActive = (link: any) => {
    if (link.href === `/${lang}/admin/add`) {
      return pathname === `/${lang}/admin/add`
    }
    return pathname === `/${lang}/admin` && currentTab === link.tab
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 border-b theme-border flex items-center justify-between bg-inherit sticky top-0 z-20 theme-bg-card">
        <span className="font-semibold theme-text text-lg">Admin Panel</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 theme-bg-card border theme-border theme-text">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-30 w-64 theme-bg-card border-r theme-border transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:block mb-8">
            <h2 className="text-2xl font-light theme-text tracking-tight">Admin</h2>
          </div>

          <nav className="flex-1 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const active = isActive(link)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-base transition-colors border-l-2
                    ${active 
                      ? 'theme-text font-medium border-brand-blue bg-brand-blue/5' 
                      : 'theme-text-muted border-transparent hover:theme-bg hover:theme-text'}
                  `}
                >
                  <Icon size={20} className={active ? 'text-brand-blue' : ''} />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="pt-8 mt-8 border-t theme-border">
            <Link href={`/${lang}`} className="flex items-center gap-3 px-4 py-3 text-base theme-text-muted hover:theme-text hover:theme-bg transition-colors">
              <ArrowLeft size={20} />
              {dict.backToSite || 'Back to Site'}
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
