'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePersistentCart } from '@/lib/hooks/usePersistentCart'
import Image from 'next/image'

interface Ingrediente {
  id: string
  nombre: string
}

interface IngredienteProducto {
  ingrediente: Ingrediente
}

interface Producto {
  id: string
  nombre: string
  precio: number
  vegano: boolean
  tipo: string
  ingredientes: IngredienteProducto[]
}

export default function MenuPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { addToCart } = usePersistentCart()

  const [preferidos, setPreferidos] = useState<Producto[]>([])
  const [restringidos, setRestringidos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [errorImagenes, setErrorImagenes] = useState<Record<string, boolean>>({})
  const [filtro, setFiltro] = useState<'todos' | 'vegano' | 'no_vegano'>('todos')
  const [tipo, setTipo] = useState<'todos' | 'Almuerzo' | 'Cena' | 'Comida Rápida'>('todos')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new URLSearchParams()
        if (filtro === 'vegano') query.append('vegano', 'true')
        if (filtro === 'no_vegano') query.append('vegano', 'false')
        if (tipo !== 'todos') query.append('tipo', tipo)

        const res = await fetch(`/api/products?${query.toString()}`)
        if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`)

        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válida')
        }

        const data = await res.json()
        setPreferidos(data.preferidos || [])
        setRestringidos(data.restringidos || [])
      } catch (error: unknown) {
        console.error('Error al obtener productos:', (error as Error).message || error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filtro, tipo, session])

  const handleAgregar = (producto: Producto) => {
    if (!session) {
      router.push('/login')
    } else {
      addToCart(producto.id, producto.precio)
    }
  }

  const handleImageError = (id: string) => {
    setErrorImagenes(prev => ({ ...prev, [id]: true }))
  }

  if (loading) {
    return <p className="text-center mt-10">Cargando menú...</p>
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800 drop-shadow">
        🍽️ Menú del Restaurante
      </h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 bg-green-50 p-4 rounded-xl shadow-inner">
        <select
          onChange={(e) => setFiltro(e.target.value as 'todos' | 'vegano' | 'no_vegano')}
          className="border border-green-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
          value={filtro}
        >
          <option value="todos">Todos los productos</option>
          <option value="vegano">Solo veganos</option>
          <option value="no_vegano">Solo no veganos</option>
        </select>

        <select
          onChange={(e) => setTipo(e.target.value as 'todos' | 'Almuerzo' | 'Cena' | 'Comida Rápida')}
          className="border border-green-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
          value={tipo}
        >
          <option value="todos">Todos los tipos</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Cena">Cena</option>
          <option value="Comida Rápida">Comida Rápida</option>
        </select>
      </div>

      {/* Productos disponibles */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 text-green-700">🟢 Productos Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {preferidos.map((producto) => {
            const id = producto.id
            const nombre = producto.nombre.toLowerCase().replace(/\s/g, '-')
            const src = errorImagenes[id] ? '/images/default.jpg' : `/images/${nombre}.jpg`

            return (
              <div key={id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all">
                <Image
                  src={src}
                  alt={producto.nombre}
                  width={400}
                  height={160}
                  className="object-cover rounded-md mb-4 w-full h-40"
                  onError={() => handleImageError(id)}
                />
                <h2 className="text-xl font-semibold text-gray-800">{producto.nombre}</h2>
                <p className="text-sm text-gray-500 capitalize">{producto.tipo}</p>
                <p className="text-sm text-green-700 mt-1 font-semibold">
                  ${producto.precio?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-sm mt-2 text-gray-600">
                  Ingredientes: {producto.ingredientes.map((i) => i.ingrediente.nombre).join(', ')}
                </p>
                <button
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => handleAgregar(producto)}
                >
                  Agregar al carrito
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Productos restringidos */}
      {session && restringidos.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">❌ Productos con Ingredientes Restringidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {restringidos.map((producto) => {
              const id = producto.id
              const nombre = producto.nombre.toLowerCase().replace(/\s/g, '-')
              const src = errorImagenes[id] ? '/images/default.jpg' : `/images/${nombre}.jpg`

              return (
                <div key={id} className="bg-red-100 p-5 rounded-xl shadow">
                  <Image
                    src={src}
                    alt={producto.nombre}
                    width={400}
                    height={160}
                    className="object-cover rounded-md mb-4 w-full h-40"
                    onError={() => handleImageError(id)}
                  />
                  <h2 className="text-xl font-semibold text-red-800">{producto.nombre}</h2>
                  <p className="text-sm text-gray-500 capitalize">{producto.tipo}</p>
                  <p className="text-sm text-red-700 font-medium mt-1">Contiene ingredientes restringidos</p>
                  <p className="text-sm mt-2 text-gray-700">
                    Ingredientes: {producto.ingredientes.map((i) => i.ingrediente.nombre).join(', ')}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
