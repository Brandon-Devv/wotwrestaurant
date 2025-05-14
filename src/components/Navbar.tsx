'use client'

import { useSession } from 'next-auth/react'
import DefaultNavbar from './DefaultNavbar'
import UserNavbar from './UserNavbar'

export default function Navbar() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  // Si está autenticado, mostramos la navbar personalizada
  if (session?.user) {
    return <UserNavbar />  // ✅ SIN props
  }

  // Si no está autenticado, mostramos la barra pública
  return <DefaultNavbar />
}
