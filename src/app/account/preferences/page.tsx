'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import axios from 'axios'

interface Ingrediente {
  id: string
  nombre: string
}

function SortableItem({ id, label }: { id: string, label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="p-2 border rounded bg-white shadow-sm hover:bg-gray-100 cursor-pointer"
      {...attributes}
      {...listeners}
    >
      {label}
    </li>
  )
}

export default function PreferencesPage() {
  const [preferencias, setPreferencias] = useState<Ingrediente[]>([])
  const [intolerancias, setIntolerancias] = useState<Ingrediente[]>([])
  const [ingredientesIniciales, setIngredientesIniciales] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/preferences')
        const preferenciasData: Ingrediente[] = res.data.preferencias || []
        const intoleranciasData: Ingrediente[] = res.data.intolerancias || []

        const all: Ingrediente[] = [...preferenciasData, ...intoleranciasData]
        setIngredientesIniciales(all)
        setPreferencias(preferenciasData)
        setIntolerancias(intoleranciasData)
      } catch (error: unknown) {
        console.error('Error al obtener preferencias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const id = String(active.id)

    const movedItem = preferencias.find((i) => i.nombre === id)
      || intolerancias.find((i) => i.nombre === id)

    if (!movedItem) return

    if (preferencias.some(i => i.id === movedItem.id)) {
      setPreferencias((prev) => prev.filter((i) => i.id !== movedItem.id))
      setIntolerancias((prev) => [...prev, movedItem])
    } else if (intolerancias.some(i => i.id === movedItem.id)) {
      setIntolerancias((prev) => prev.filter((i) => i.id !== movedItem.id))
      setPreferencias((prev) => [...prev, movedItem])
    }
  }

  async function handleGuardar() {
    try {
      await axios.post('/api/preferences', { intolerancias: intolerancias.map(i => i.id) })
      alert('Preferencias actualizadas correctamente.')
    } catch {
      alert('Error al guardar preferencias.')
    }
  }

  function handleReset() {
    const idsIntolerancias = intolerancias.map(i => i.id)
    const nuevasPreferencias = ingredientesIniciales.filter(i => !idsIntolerancias.includes(i.id))
    setPreferencias(nuevasPreferencias)
    setIntolerancias([])
  }

  if (loading) return <p className="text-center mt-10">Cargando preferencias...</p>

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-5xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          🍽️ Preferencias Alimentarias
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Arrastra los ingredientes que no toleras al cuadro de intolerancias.
        </p>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-green-900 mb-4">✅ Preferencias</h2>
              <SortableContext items={preferencias.map(i => i.nombre)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {preferencias.map((item) => (
                    <SortableItem key={item.id} id={item.nombre} label={item.nombre} />
                  ))}
                </ul>
              </SortableContext>
            </div>

            <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-red-700 mb-4">🚫 Intolerancias</h2>
              <SortableContext items={intolerancias.map(i => i.nombre)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {intolerancias.map((item) => (
                    <SortableItem key={item.id} id={item.nombre} label={item.nombre} />
                  ))}
                </ul>
              </SortableContext>
            </div>
          </div>
        </DndContext>

        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Resetear preferencias
          </button>
          <button
            onClick={handleGuardar}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Guardar preferencias
          </button>
        </div>
      </div>
    </main>
  )
}
