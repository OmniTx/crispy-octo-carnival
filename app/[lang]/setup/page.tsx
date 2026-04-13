'use client'

import { useState, useEffect } from 'react'
import { supabaseClient as supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { dictionaries, Locale } from '@/i18n/dictionaries'
import { UserPlus, Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

export default function SetupPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = dictionaries[lang as Locale] || dictionaries.en
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Attempt to sign up the first admin
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
    } else if (data.user && data.user.identities?.length === 0) {
      // Identity length 0 often means user already exists in some Supabase configs
      setError('An account with this email may already exist. Try logging in.')
      setLoading(false)
    } else {
      // Manual cookie sync if a session was created during signup
      if (data.session) {
        const expires = new Date(Date.now() + data.session.expires_in * 1000).toUTCString()
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; expires=${expires}; SameSite=Lax;`
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; expires=${expires}; SameSite=Lax;`
      }
      
      setSuccess(true)
      setLoading(false)
      // Automatically log them in or redirect to login after a few seconds
      setTimeout(() => {
        router.push(`/${lang}/login`)
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-8 bg-ibm-gray900 border border-ibm-blue/50 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-ibm-blue/10 rotate-45 translate-x-8 -translate-y-8 border-b border-ibm-blue/20"></div>
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="h-12 w-12 bg-ibm-blue flex items-center justify-center text-white ring-8 ring-ibm-blue/10">
               <ShieldCheck size={28} />
             </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight theme-text">Admin Setup</h1>
          <p className="theme-text-muted text-sm tracking-wide uppercase">One-time registration</p>
        </div>

        {success ? (
          <div className="bg-green-900/20 border border-green-500/50 p-6 text-center space-y-4">
            <div className="text-green-400 font-semibold text-lg flex items-center justify-center gap-2">
              <ShieldCheck size={20} />
              Setup Complete!
            </div>
            <p className="theme-text-muted text-sm">
              Your admin account has been created. Redirecting to login...
            </p>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-ibm-blue" size={24} />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-ibm-blue/5 border-l-4 border-ibm-blue p-4 text-xs theme-text-muted leading-relaxed">
              <strong>Note:</strong> Use this page to create your initial administrative account. 
              Once the account is created, you should remove this page or disable new sign-ups in your Supabase dashboard.
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 p-4 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSetup} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="ibm-label">Admin Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ibm-input"
                    required
                    placeholder="e.g. admin@yourshop.com"
                  />
                </div>
                <div>
                  <label className="ibm-label">Admin Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ibm-input"
                    required
                    minLength={6}
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
                    <UserPlus size={18} />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="text-center pt-4 border-t border-ibm-gray800">
           <p className="text-[10px] theme-text-muted uppercase tracking-widest opacity-50">
             Security Initialized
           </p>
        </div>
      </div>
    </div>
  )
}
