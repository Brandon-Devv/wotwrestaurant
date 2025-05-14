'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface ProductoItem {
  id: string
  nombre: string
  precio: number
}

interface ItemPedido {
  cantidad: number
  subtotal: number
  producto: ProductoItem
}

interface Pedido {
  id: string
  fecha: string
  total: number
  user: {
    name: string
    email: string
  }
  items: ItemPedido[]
}

export default function ConfirmacionContent() {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      router.push('/')
      return
    }

    async function fetchPedido() {
      try {
        const res = await fetch(`/api/pedidos/${id}`)
        if (!res.ok) throw new Error('No se pudo obtener el pedido')
        const data = await res.json()
        setPedido(data)
      } catch {
        alert('Error al obtener el pedido')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [searchParams, router])

  if (loading) return <p className="text-center mt-10">Cargando confirmación...</p>
  if (!pedido) return null

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-3xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
          ✅ Pedido Confirmado
        </h1>

        <div className="space-y-3 text-gray-800">
          <p><strong>ID del pedido:</strong> {pedido.id}</p>
          <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
          <p><strong>Nombre:</strong> {pedido.user.name}</p>
          <p><strong>Email:</strong> {pedido.user.email}</p>
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-xl font-semibold mb-3 text-green-700">🧾 Detalle del pedido</h2>
        <ul className="space-y-2">
          {pedido.items.map((item, index) => (
            <li key={index} className="flex justify-between bg-gray-50 p-2 rounded shadow-sm">
              <span>{item.cantidad}x {item.producto.nombre}</span>
              <span>${item.subtotal.toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <hr className="my-6 border-gray-300" />
        <p className="text-right text-xl font-bold">
          Total: <span className="text-green-700">${pedido.total.toLocaleString()}</span>
        </p>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  )
}
