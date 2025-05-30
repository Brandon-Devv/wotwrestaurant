'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Ingredient } from '@prisma/client'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

export default function PreferenciasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [ingredientes, setIngredientes] = useState<Ingredient[]>([])
  const [intolerancias, setIntolerancias] = useState<Ingredient[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.email) return

    fetch('/api/preferences')
      .then((res) => res.json())
      .then((data: { preferencias: Ingredient[]; intolerancias: Ingredient[] }) => {
        setIngredientes(data.preferencias)
        setIntolerancias(data.intolerancias)
      })
      .catch((err: unknown) => {
        console.error('Error al obtener preferencias:', err)
      })
  }, [session])

  const mover = (id: string, hacia: 'intolerancias' | 'preferencias') => {
    if (hacia === 'intolerancias') {
      const ingrediente = ingredientes.find((i) => i.id === id)
      if (ingrediente) {
        setIngredientes((prev) => prev.filter((i) => i.id !== id))
        setIntolerancias((prev) => [...prev, ingrediente])
      }
    } else {
      const ingrediente = intolerancias.find((i) => i.id === id)
      if (ingrediente) {
        setIntolerancias((prev) => prev.filter((i) => i.id !== id))
        setIngredientes((prev) => [...prev, ingrediente])
      }
    }
  }

  const actualizar = async () => {
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intolerancias: intolerancias.map((i) => i.id) }),
      })

      if (!res.ok) throw new Error('Error al actualizar preferencias')
      toast.success('Preferencias actualizadas correctamente')
    } catch {
      toast.error('Error al actualizar intolerancias')
    }
  }

  if (status === 'loading') {
    return <p className="text-center mt-10">Cargando preferencias...</p>
  }

  if (!session) return null

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">🍽️ Preferencias Alimentarias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">✅ Preferencias (por defecto)</h2>
            <ScrollArea className="h-72 pr-2">
              {ingredientes.length > 0 ? ingredientes.map((ing) => (
                <div
                  key={ing.id}
                  className="cursor-pointer p-2 border rounded mb-1 hover:bg-green-100 transition"
                  onClick={() => mover(ing.id, 'intolerancias')}
                >
                  {ing.nombre}
                </div>
              )) : <p className="text-gray-500 text-sm text-center">No hay ingredientes disponibles</p>}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🚫 Intolerancias</h2>
            <ScrollArea className="h-72 pr-2">
              {intolerancias.length > 0 ? intolerancias.map((ing) => (
                <div
                  key={ing.id}
                  className="cursor-pointer p-2 border rounded mb-1 hover:bg-red-100 transition"
                  onClick={() => mover(ing.id, 'preferencias')}
                >
                  {ing.nombre}
                </div>
              )) : <p className="text-gray-500 text-sm text-center">No hay ingredientes seleccionados</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={actualizar}
          className="px-6 py-2 text-white bg-green-600 hover:bg-green-700"
        >
          Guardar preferencias
        </Button>
      </div>
    </div>
  )
}
