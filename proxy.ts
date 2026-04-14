import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')

  // Redirect root path / to a language-prefixed path based on country
  if (path === '/') {
    // Check for country header (Vercel or Cloudflare)
    const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || ''
    
    // If from Bangladesh, default to Bengali, otherwise English
    const preferredLang = country === 'BD' ? 'bn' : 'en'
    return NextResponse.redirect(new URL(`/${preferredLang}`, req.url))
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
