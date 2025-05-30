import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'CLIENT'
      email: string
      name?: string
      phone?: string
    }
  }

  interface User {
    id: string
    role: 'ADMIN' | 'CLIENT'
    email: string
    name?: string
    phone?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'ADMIN' | 'CLIENT'
    email?: string
    name?: string
    phone?: string
  }
}
