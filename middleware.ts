// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'admin'

    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/profile') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
}
