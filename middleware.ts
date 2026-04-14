import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')

  // Redirect root path / to a language-prefixed path
  if (path === '/') {
    // Check for language preference in cookie first
    const cookieLang = req.cookies.get('lang')?.value
    if (cookieLang === 'bn' || cookieLang === 'en') {
      return NextResponse.redirect(new URL(`/${cookieLang}`, req.url))
    }

    // Otherwise, check Accept-Language header
    const acceptLanguage = req.headers.get('accept-language') || ''
    const preferredLang = acceptLanguage.toLowerCase().includes('bn') ? 'bn' : 'en'
    return NextResponse.redirect(new URL(`/${preferredLang}`, req.url))
  }

  const isProtectedPath = path.includes('/admin') || path.includes('/add')
  const isLoginPage = path.includes('/login') || path.includes('/setup')

  const segments = path.split('/')
  const lang = segments[1]

  // If visiting a language-prefixed path, ensure we save it to the cookie for future root visits
  const response = NextResponse.next()
  if (lang === 'en' || lang === 'bn') {
    response.cookies.set('lang', lang, { maxAge: 60 * 60 * 24 * 30, path: '/' }) // 30 days
  }

  if (isProtectedPath && !isLoginPage && !hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'en'}/login`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (isLoginPage && hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'en'}/admin`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
