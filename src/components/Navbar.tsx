'use client'

import { useSession } from 'next-auth/react'
import DefaultNavbar from './DefaultNavbar'
import UserNavbar from './UserNavbar'

export default function Navbar() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  // Si está autenticado, mostramos la navbar personalizada según el rol
  if (session?.user) {
    return <UserNavbar role={session.user.role} name={session.user.name} />
  }

  // Si no está autenticado, mostramos la barra pública
  return <DefaultNavbar />
}