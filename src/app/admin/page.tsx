'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading' && (!session?.user || session.user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') return <div className="p-6">Cargando sesión...</div>

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-4xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          🛠️ Panel de Administración
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            title="📈 Dashboard de Ventas"
            description="Consulta las ventas realizadas hoy, esta semana y en el mes."
            onClick={() => router.push('/admin/dashboard')}
          />
          <Card
            title="🧾 Matriz de Trazabilidad"
            description="Gestiona la información completa de los ingredientes."
            onClick={() => router.push('/admin/ingredients')}
          />
          <Card
            title="📦 Gestión de Stock"
            description="Administra el stock y los precios de los productos."
            onClick={() => router.push('/admin/products')}
          />
          <Card
            title="👥 Administrar Usuarios"
            description="Visualiza usuarios registrados y cambia sus roles."
            onClick={() => router.push('/admin/users')}
          />
        </div>
      </div>
    </main>
  )
}

function Card({
  title,
  description,
  onClick,
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border border-gray-100 rounded-lg p-6 shadow hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
    >
      <h2 className="text-xl font-semibold mb-2 text-green-800">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
