'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

export default function UserNavbar() {
  const { data: session } = useSession()
  const name = session?.user?.name ?? 'Usuario'
  const role = session?.user?.role ?? 'CLIENT'

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow">
      {/* Izquierda: logo + saludo */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src="/images/logoblanco.jpg"
            alt="Wonders Logo"
            width={40}
            height={40}
            className="rounded-full object-cover border border-white"
          />
        </Link>
        <span className="text-sm md:text-base">Hola, {name.split(' ')[0]}</span> 
      </div>

      {/* Derecha: enlaces */}
      <div className="flex items-center space-x-4">
        {role === 'CLIENT' && <Link href="/client" className="hover:underline">Mi Panel</Link>}
        {role === 'ADMIN' && <Link href="/admin" className="hover:underline">Panel Admin</Link>}
        <Link href="/menu" className="hover:underline">Menú</Link>
        <Link href="/carrito" className="hover:underline">Carrito</Link>
        <Link href="/account" className="hover:underline">Mi cuenta</Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
