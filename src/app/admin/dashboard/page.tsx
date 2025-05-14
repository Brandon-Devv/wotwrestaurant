'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  hoy: number
  semana: number
  mes: number
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div className="p-6">Cargando métricas...</div>

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-4xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
          📈 Dashboard de Ventas
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
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
