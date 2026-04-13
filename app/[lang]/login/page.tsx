'use client'

import { useState } from 'react'
import { supabaseClient as supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
    } else if (data.session) {
      // Manual cookie sync since we aren't using the Supabase SSR helpers
      const expires = new Date(Date.now() + data.session.expires_in * 1000).toUTCString()
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; expires=${expires}; SameSite=Lax;`
      document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; expires=${expires}; SameSite=Lax;`
      
      router.push(`/${lang}/admin`)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-8 bg-ibm-gray900 dark:bg-ibm-gray900 border border-ibm-gray800 p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="h-12 w-12 bg-ibm-blue flex items-center justify-center text-white font-bold text-2xl">
               H
             </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight theme-text">{dict.adminPanel}</h1>
          <p className="theme-text-muted text-sm tracking-wide uppercase">{dict.loginDescription || 'Sign in to manage catalog'}</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 p-4 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="ibm-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ibm-input"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="ibm-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ibm-input"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ibm-btn w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn size={18} />
                <span>{dict.login || 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-ibm-gray800">
           <p className="text-xs theme-text-muted">
             Herbs Catalog Management v1.0
           </p>
        </div>
      </div>
    </div>
  )
}
