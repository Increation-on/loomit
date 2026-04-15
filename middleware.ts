// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Временная заглушка — позже добавим проверку сессии
  const isAuthenticated = request.cookies.has('next-auth.session-token') || 
                          request.cookies.has('__Secure-next-auth.session-token')
  const isAdmin = request.cookies.has('admin-auth')

  // Защита /profile/*
  if (pathname.startsWith('/profile')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Защита /admin/*
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*']
}