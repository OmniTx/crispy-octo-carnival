'use client'

import { use, useActionState } from 'react'
import { setupAdmin, isSetupNeeded } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { UserPlus, Loader2, AlertCircle, ShieldCheck, Lock } from 'lucide-react'

export default function SetupPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const dict = dictionaries[lang as Locale] || dictionaries.bn

  // Server-side check
  const needed = use(isSetupNeeded())
  if (!needed) {
    redirect(`/${lang}/login`)
  }

  const [state, formAction, isPending] = useActionState(setupAdmin, {
    success: false,
    error: null,
  })

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-8 bg-brand-gray900 border border-brand-blue/50 p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="flex justify-center mb-6">
             <div className="h-12 w-12 bg-green-600 flex items-center justify-center text-white ring-8 ring-green-600/10">
               <ShieldCheck size={28} />
             </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">Setup Complete!</h1>
          <p className="theme-text-muted text-sm">
            Your admin account has been created successfully.
          </p>
          <a
            href={`/${lang}/login`}
            className="app-btn w-full inline-block mt-6"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-8 bg-brand-gray900 border border-brand-blue/50 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/10 rotate-45 translate-x-8 -translate-y-8 border-b border-brand-blue/20"></div>
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="h-12 w-12 bg-brand-blue flex items-center justify-center text-white ring-8 ring-brand-blue/10">
               <ShieldCheck size={28} />
             </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight theme-text">Admin Setup</h1>
          <p className="theme-text-muted text-sm tracking-wide uppercase">One-time registration</p>
        </div>

        <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-4 text-xs theme-text-muted leading-relaxed">
          <strong>Note:</strong> This page is only accessible when no administrative accounts exist. 
          Once the first admin is created, this page will be disabled automatically.
        </div>

        {state.error && (
          <div className="bg-red-900/20 border border-red-500/50 p-4 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="app-label">Admin Email</label>
              <input
                name="email"
                type="email"
                className="app-input"
                required
                placeholder="e.g. admin@yourshop.com"
              />
            </div>
            <div>
              <label className="app-label">Admin Password</label>
              <input
                name="password"
                type="password"
                className="app-input"
                required
                minLength={6}
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
                <UserPlus size={18} />
                <span>Create Admin Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-brand-gray800">
           <p className="text-[10px] theme-text-muted uppercase tracking-widest opacity-50 flex items-center justify-center gap-1">
             <Lock size={10} /> Security Initialized
           </p>
        </div>
      </div>
    </div>
  )
}
