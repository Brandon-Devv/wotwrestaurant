'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Product {
  id: string
  nombre: string
  precio: number
  stock: number
  vegano: boolean
  tipo: string
}

export default function AdminProductsPage() {
  const { data: session } = useSession()
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProductos(data)
        setLoading(false)
      })
  }, [])

  const handleChange = (
    id: string,
    field: keyof Pick<Product, 'precio' | 'stock'>,
    value: string
  ) => {
    const numericValue = value.replace(/\D/g, '') // solo dígitos
    setProductos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: parseInt(numericValue) || 0 } : p
      )
    )
  }

  const handleGuardar = async (id: string) => {
    const producto = productos.find(p => p.id === id)
    if (!producto) return

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        precio: producto.precio,
        stock: producto.stock,
      }),
    })

    if (res.ok) {
      alert('Producto actualizado correctamente')
    } else {
      alert('Error al actualizar producto')
    }
  }

  const handleImageError = (id: string) => {
    setErrorImages(prev => ({ ...prev, [id]: true }))
  }

  const onlyAllowDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End']
    const isControl = allowedKeys.includes(e.key)
    const isNumber = /^\d$/.test(e.key)

    if (!isNumber && !isControl) {
      e.preventDefault()
    }
  }

  if (!session || session.user.role !== 'ADMIN') {
    return <p className="p-4">No autorizado.</p>
  }

  if (loading) return <p className="p-4">Cargando productos...</p>

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">🛠️ Administración de Productos</h1>

      <div className="grid grid-cols-1 gap-6">
        {productos.map(producto => {
          const imageName = producto.nombre.toLowerCase().replace(/\s/g, '-')
          const imagePath = errorImages[producto.id]
            ? '/images/default.jpg'
            : `/images/${imageName}.jpg`

          return (
            <div
              key={producto.id}
              className="flex items-center gap-6 p-4 rounded shadow bg-white border border-gray-200"
            >
              <div className="relative w-32 h-32">
                <Image
                  src={imagePath}
                  alt={producto.nombre}
                  fill
                  className="object-cover rounded"
                  onError={() => handleImageError(producto.id)}
                />
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold">{producto.nombre}</h2>
                <p className="text-sm text-gray-500 capitalize">Tipo: {producto.tipo}</p>

                <div className="flex gap-4">
                  <div>
                    <label className="text-sm block text-gray-600">Precio ($)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={isNaN(producto.precio) ? '' : producto.precio}
                      onChange={e => handleChange(producto.id, 'precio', e.target.value)}
                      onKeyDown={onlyAllowDigits}
                      className="border px-2 py-1 rounded w-24"
                    />
                  </div>
                  <div>
                    <label className="text-sm block text-gray-600">Stock</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={isNaN(producto.stock) ? '' : producto.stock}
                      onChange={e => handleChange(producto.id, 'stock', e.target.value)}
                      onKeyDown={onlyAllowDigits}
                      className="border px-2 py-1 rounded w-20"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleGuardar(producto.id)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
