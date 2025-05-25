'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function BackgroundWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const sinFondo = pathname === '/' || pathname === '/login' || pathname === '/register'

  if (sinFondo) return <>{children}</>

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-6xl mx-auto rounded-2xl p-8 shadow-2xl">
        {children}
      </div>
    </main>
  )
}
