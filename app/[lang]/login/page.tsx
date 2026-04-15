'use client'

import { use, useActionState, useEffect } from 'react'
import { loginAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const dict = dictionaries[lang as Locale] || dictionaries.en
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      router.push(`/${lang}/admin`)
      router.refresh()
    }
  }, [state.success, lang, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-8 theme-bg-card border theme-border p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="h-12 w-12 bg-brand-blue flex items-center justify-center text-white font-bold text-2xl">
               H
             </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight theme-text">{dict.adminPanel}</h1>
          <p className="theme-text-muted text-sm tracking-wide uppercase">{dict.loginDescription || 'Sign in to manage catalog'}</p>
        </div>

        {state.error && (
          <div className="bg-red-900/20 dark:bg-red-900/20 border border-red-500/50 p-4 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="app-label">Email Address</label>
              <input
                name="email"
                type="email"
                className="app-input"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="app-label">Password</label>
              <input
                name="password"
                type="password"
                className="app-input"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="app-btn w-full flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn size={18} />
                <span>{dict.login || 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t theme-border">
           <p className="text-xs theme-text-muted">
             Herbs Catalog Management v1.0
           </p>
        </div>
      </div>
    </div>
  )
}
