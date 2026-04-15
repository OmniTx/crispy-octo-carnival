'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function HeaderAdminLink({ lang, dict }: { lang: string, dict: any }) {
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Check for Supabase access token in cookies
    const checkSession = () => {
      const cookies = document.cookie.split(';')
      const session = cookies.some(c => c.trim().startsWith('sb-access-token=') || c.trim().startsWith('sb-refresh-token='))
      setHasSession(session)
    }

    checkSession()
    // Optional: listen for cookie changes or session updates if needed
  }, [])

  if (!hasSession) return null

  return (
    <Link
      href={`/${lang}/admin`}
      className="theme-text-muted hover:text-brand-blue transition-colors"
      title={dict.adminPanel}
    >
      <Settings size={18} />
    </Link>
  )
}
