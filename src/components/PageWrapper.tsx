'use client'

import { usePathname } from 'next/navigation'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const exclude = ['/', '/login', '/register']
  const showBackground = !exclude.includes(path)

  return (
    <div className="relative min-h-screen">
      {showBackground && (
        <>
          <div
            className="absolute inset-0 bg-white bg-[url('/images/fondovectores.png')] bg-repeat opacity-90 z-0"
            style={{ backgroundSize: '300px' }}
          />
          <div className="absolute inset-0 bg-white opacity-60 z-0" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
