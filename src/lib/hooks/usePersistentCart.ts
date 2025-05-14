// ✅ src/lib/hooks/usePersistentCart.ts

'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface CarritoItem {
  id: string
  productoId: string
  producto: {
    nombre: string
  }
  cantidad: number
  precioUnitario: number
}

export function usePersistentCart() {
  const { data: session } = useSession()
  const [items, setItems] = useState<CarritoItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    if (!session?.user?.email) return
    setLoading(true)
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      if (res.ok) {
        setItems(data)
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productoId: string, precioUnitario: number) => {
  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, cantidad: 1, precioUnitario }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems(updated)
    } else {
      console.error('Error al agregar producto al carrito')
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error)
  }
  }
  const removeFromCart = async (productoId: string) => {
    try {
      const res = await fetch(`/api/cart/${productoId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.productoId !== productoId))
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
    }
  }

  const updateQuantity = async (productoId: string, cantidad: number) => {
    try {
      const res = await fetch(`/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId, cantidad }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.productoId === productoId ? { ...item, cantidad } : item
          )
        )
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
    }
  }

  const total = items.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  )

  const checkout = async () => {
    try {
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
      if (res.ok) {
        const { pedidoId } = await res.json()
        setItems([])
        return pedidoId
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error)
    }
  }
  const clearCart = async () => {
  if (!session?.user?.email) return
  try {
    await fetch(`/api/cart`, {
      method: 'DELETE',
    })
    setItems([])
  } catch (error) {
    console.error('Error al limpiar el carrito:', error)
  }
 }
  useEffect(() => {
    fetchCart()
  }, [session])

  return {items, loading, addToCart, removeFromCart, updateQuantity, clearCart, total, checkout}
}
