import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register'
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isClientPage = req.nextUrl.pathname.startsWith('/client')

  // Si no hay sesión y no es login o registro, redirige al login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si hay sesión pero trata de entrar a login o registro, redirige según rol
  if (token && isAuthPage) {
    const role = token.role
    const redirectTo = role === 'ADMIN' ? '/admin' : '/client'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  // Si hay sesión pero intenta acceder a una ruta no permitida
  if (token) {
    if (isAdminPage && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/client', req.url))
    }

    if (isClientPage && token.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/login', '/register', '/checkout', '/cart'],
}
