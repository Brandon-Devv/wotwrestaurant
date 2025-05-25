'use client'

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

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
  const [historial, setHistorial] = useState<Pedido[]>([])

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  const minDate = new Date(2025, 3, 1)

  const [startDate, setStartDate] = useState<Date | null>(startOfDay)
  const [endDate, setEndDate] = useState<Date | null>(endOfDay)

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) return

    const params = new URLSearchParams()
    const start = new Date(startDate)
    const end = new Date(endDate)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    params.append('startDate', start.toISOString())
    params.append('endDate', end.toISOString())

    fetch(`/api/admin/dashboard/history?${params.toString()}`)
      .then(res => res.json())
      .then(setHistorial)
      .catch(err => console.error('Error al cargar historial:', err))
  }, [startDate, endDate])

  const totalIngresos = historial.reduce((sum, p) => sum + p.total, 0)
  const totalPedidos = historial.length
  const totalProductos = historial.flatMap(p => p.productos).reduce((sum, item) => sum + item.cantidad, 0)
  const promedioPorPedido = totalPedidos ? totalIngresos / totalPedidos : 0

  const dataGrafico = Object.values(
    historial.flatMap(p => p.productos).reduce((acc, item) => {
      acc[item.nombre] = acc[item.nombre] || { nombre: item.nombre, cantidad: 0 }
      acc[item.nombre].cantidad += item.cantidad
      return acc
    }, {} as Record<string, { nombre: string; cantidad: number }>)
  )

  const colores = ['#4ade80', '#facc15', '#60a5fa', '#fb7185', '#a78bfa', '#f472b6', '#34d399']

  function exportarPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Reporte de Ventas - Wonders Of The World Bogotá', 14, 20)

    if (startDate && endDate) {
      doc.setFontSize(10)
      doc.text(`Desde: ${startDate.toLocaleDateString()}  Hasta: ${endDate.toLocaleDateString()}`, 14, 28)
    }

    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Usuario', 'Productos', 'Total']],
      body: historial.map(p => [
        new Date(p.fecha).toLocaleString(),
        p.usuario,
        p.productos.map(pr => `${pr.nombre} (${pr.cantidad})`).join(', '),
        `$${p.total.toLocaleString()}`
      ])
    })

    const finalY = (doc as any).lastAutoTable?.finalY || 35

    doc.setFontSize(11)
    doc.text(`Total Ingresos: $${totalIngresos.toLocaleString()}`, 14, finalY + 10)
    doc.text(`Total Pedidos: ${totalPedidos}`, 14, finalY + 16)
    doc.text(`Total Productos Vendidos: ${totalProductos}`, 14, finalY + 22)
    doc.text(`Promedio por Pedido: $${promedioPorPedido.toFixed(2)}`, 14, finalY + 28)

    doc.save('reporte_ventas.pdf')
  }

  return (
    <main className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10" style={{ backgroundImage: "url('/images/fondovectores.png')" }}>
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-6xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">📈 Dashboard de Ventas</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Desde:</label>
            <DatePicker
              selected={startDate ?? undefined}
              onChange={setStartDate}
              selectsStart
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              minDate={minDate}
              maxDate={new Date()}
              onChangeRaw={(e) => {
                if (e?.preventDefault) e.preventDefault()
              }}
              className="border px-4 py-2 rounded-md w-48 cursor-pointer"
              dateFormat="yyyy-MM-dd"
              placeholderText="Fecha inicial"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Hasta:</label>
            <DatePicker
              selected={endDate ?? undefined}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              minDate={startDate ?? minDate}
              maxDate={new Date()}
              onChangeRaw={(e) => {
                if (e?.preventDefault) e.preventDefault()
              }}
              className="border px-4 py-2 rounded-md w-48 cursor-pointer"
              dateFormat="yyyy-MM-dd"
              placeholderText="Fecha final"
            />
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button onClick={exportarPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Exportar PDF
          </button>
        </div>

        {dataGrafico.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">🥧 Productos más vendidos</h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="cantidad"
                    data={dataGrafico}
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {dataGrafico.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <h2 className="font-semibold text-green-700">Total Ingresos</h2>
            <p className="text-2xl font-bold">${totalIngresos.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <h2 className="font-semibold text-green-700">Total Pedidos</h2>
            <p className="text-2xl font-bold">{totalPedidos}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <h2 className="font-semibold text-green-700">Total Productos Vendidos</h2>
            <p className="text-2xl font-bold">{totalProductos}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <h2 className="font-semibold text-green-700">Promedio por Pedido</h2>
            <p className="text-2xl font-bold">${promedioPorPedido.toFixed(2)}</p>
          </div>
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
                    No hay pedidos registrados en este rango.
                  </td>
                </tr>
              ) : (
                historial.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(pedido.fecha).toLocaleString()}</td>
                    <td className="px-4 py-2">{pedido.usuario}</td>
                    <td className="px-4 py-2">{pedido.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')}</td>
                    <td className="px-4 py-2 font-semibold">${pedido.total.toLocaleString()}</td>
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
