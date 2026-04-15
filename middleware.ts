import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')

  // Redirect root path / to a language-prefixed path
  // (Simplified: default to Bengali)
  if (path === '/') {
    return NextResponse.redirect(new URL('/bn', req.url))
  }

  const isProtectedPath = path.includes('/admin') || path.includes('/add')
  const isLoginPage = path.includes('/login') || path.includes('/setup')

  const segments = path.split('/')
  const lang = segments[1]

  if (isProtectedPath && !isLoginPage && !hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'bn'}/login`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (isLoginPage && hasAuthCookie) {
    const redirectUrl = new URL(`/${lang || 'bn'}/admin`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
