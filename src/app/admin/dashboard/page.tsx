'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  hoy: number
  semana: number
  mes: number
}

interface Pedido {
  id: string
  fecha: string
  total: number
  usuario: string
  productos: {
    nombre: string
    cantidad: number
  }[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [historial, setHistorial] = useState<Pedido[]>([])

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setData)

    fetch('/api/admin/dashboard/history')
      .then(res => res.json())
      .then(setHistorial)
      .catch(err => console.error('Error al cargar historial:', err))
  }, [])

  if (!data) return <div className="p-6">Cargando métricas...</div>

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-6xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
          📈 Dashboard de Ventas
        </h1>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card
            color="green"
            title="Ventas de Hoy"
            value={data.hoy}
            description="Pedidos desde las 00:00 de hoy."
          />
          <Card
            color="yellow"
            title="Últimos 7 días"
            value={data.semana}
            description="Total acumulado de la última semana."
          />
          <Card
            color="blue"
            title="Últimos 30 días"
            value={data.mes}
            description="Métricas del último mes calendario."
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Historial de Pedidos</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-green-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Productos</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No hay pedidos registrados aún.
                  </td>
                </tr>
              ) : (
                historial.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {new Date(pedido.fecha).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{pedido.usuario}</td>
                    <td className="px-4 py-2">
                      {pedido.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')}
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      ${pedido.total.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function Card({
  color,
  title,
  value,
  description,
}: {
  color: 'green' | 'yellow' | 'blue'
  title: string
  value: number
  description: string
}) {
  const colorMap = {
    green: { text: 'text-green-800', bg: 'bg-green-100' },
    yellow: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
    blue: { text: 'text-blue-800', bg: 'bg-blue-100' },
  }

  return (
    <div className={`rounded-xl shadow-md p-6 hover:shadow-lg transition ${colorMap[color].bg}`}>
      <h2 className={`text-lg font-semibold ${colorMap[color].text}`}>{title}</h2>
      <p className={`text-2xl font-bold mt-2 ${colorMap[color].text}`}>
        ${value.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  )
}
