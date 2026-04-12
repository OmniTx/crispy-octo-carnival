import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Simple check for Supabase auth cookies
  // Supabase browser client typically sets cookies starting with 'sb-'
  const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')

  const path = req.nextUrl.pathname

  // Redirect root path to default locale
  if (path === '/') {
    return NextResponse.redirect(new URL('/en', req.url))
  }
  const isProtectedPath = path.includes('/admin') || path.includes('/add')
  const isLoginPage = path.includes('/login') || path.includes('/setup')

  // Extract lang from path (supports /[lang]/...)
  const segments = path.split('/')
  const lang = segments[1] || 'en'

  if (isProtectedPath && !isLoginPage && !hasAuthCookie) {
    return NextResponse.redirect(new URL(`/${lang}/login`, req.url))
  }

  if (isLoginPage && hasAuthCookie) {
    return NextResponse.redirect(new URL(`/${lang}/admin`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
