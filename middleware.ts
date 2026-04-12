import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Simple check for Supabase auth cookies
  // Supabase browser client typically sets cookies starting with 'sb-'
  const allCookies = req.cookies.getAll()
  const hasAuthCookie = allCookies.some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')) 
    || req.cookies.get('sb-access-token')

  const path = req.nextUrl.pathname
  const isProtectedPath = path.includes('/admin') || path.includes('/add')
  const isLoginPage = path.includes('/login') || path.includes('/setup')

  // Extract lang from path (supports /[lang]/...)
  const segments = path.split('/')
  const lang = segments[1] || 'en'

  if (isProtectedPath && !hasAuthCookie) {
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
