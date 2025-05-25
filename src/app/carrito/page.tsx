'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { usePersistentCart } from '@/lib/hooks/usePersistentCart'

export default function CarritoPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart } = usePersistentCart()
  const [loading, setLoading] = useState(false)

  const total = items.reduce((sum: number, item) => sum + item.precioUnitario * item.cantidad, 0)

  const handlePagar = async () => {
    if (!items.length || !session?.user?.email) return
    try {
      setLoading(true)
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.productoId,
            cantidad: item.cantidad,
            subtotal: item.precioUnitario * item.cantidad,
          })),
          total,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        clearCart()
        router.push(`/carrito/confirmacion?id=${data.pedidoId}`)
      } else {
        alert('Error al pagar: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Error interno al procesar el pago.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
        🛒 Carrito de Compras
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-semibold text-lg">{item.producto.nombre}</p>
                <p className="text-sm text-gray-600">
                  ${item.precioUnitario.toLocaleString()} x {item.cantidad} = ${' '}
                  {(item.precioUnitario * item.cantidad).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center font-medium text-gray-800">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productoId)}
                  className="ml-4 text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-8">
            <p className="text-xl font-semibold mb-4">
              Total: <span className="text-green-600">${total.toLocaleString()}</span>
            </p>
            <button
              onClick={handlePagar}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Pagar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
