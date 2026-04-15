import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')

  // Redirect root path / to a language-prefixed path
  // (Simplified: default to English)
  if (path === '/') {
    return NextResponse.redirect(new URL('/en', req.url))
  }

  const isProtectedPath = path.includes('/admin') || path.includes('/add')
  const isLoginPage = path.includes('/login') || path.includes('/setup')

  const segments = path.split('/')
  const lang = segments[1]

  if (isProtectedPath && !isLoginPage && !hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'en'}/login`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (isLoginPage && hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'en'}/admin`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
