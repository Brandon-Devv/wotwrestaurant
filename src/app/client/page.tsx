'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <p className="p-4">Cargando sesión...</p>
  }

  if (!session?.user) {
    router.push('/login')
    return null
  }

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-3xl w-full rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-10 drop-shadow">
          🌿 Bienvenido/a, {session.user.name?.split(' ')[0] || 'Usuario'}
        </h1>

        <div className="grid gap-6">
          <div
            onClick={() => router.push('/menu')}
            className="cursor-pointer bg-green-50 hover:bg-green-100 transition-all duration-200 border border-green-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
          >
            <div className="text-green-700 text-3xl">🍽️</div>
            <div>
              <h2 className="text-xl font-semibold text-green-900">Ver Menú</h2>
              <p className="text-gray-600 text-sm">Explora todos los platos disponibles según tus preferencias.</p>
            </div>
          </div>

          <div
            onClick={() => router.push('/account/preferences')}
            className="cursor-pointer bg-green-50 hover:bg-green-100 transition-all duration-200 border border-green-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
          >
            <div className="text-green-700 text-3xl">⚙️</div>
            <div>
              <h2 className="text-xl font-semibold text-green-900">Gestionar Preferencias</h2>
              <p className="text-gray-600 text-sm">Actualiza los ingredientes que no puedes consumir.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
