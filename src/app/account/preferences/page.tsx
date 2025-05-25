'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="p-2 border rounded bg-white shadow-sm hover:bg-gray-100"
      {...attributes}
      {...listeners}
    >
      {label}
    </li>
  )
}

export default function PreferencesPage() {
  const { status } = useSession()
  const router = useRouter()

  const [preferencias, setPreferencias] = useState<Ingrediente[]>([])
  const [intolerancias, setIntolerancias] = useState<Ingrediente[]>([])
  const [ingredientesIniciales, setIngredientesIniciales] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      axios.get('/api/preferences').then(res => {
        const pref: Ingrediente[] = res.data.preferencias || []
        const intol: Ingrediente[] = res.data.intolerancias || []
        setPreferencias(pref)
        setIntolerancias(intol)
        setIngredientesIniciales([...pref, ...intol])
      }).catch(err => {
        console.error('Error al obtener preferencias:', err)
      }).finally(() => setLoading(false))
    }
  }, [status])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const id = String(active.id)

    const moved = preferencias.find(i => i.id === id) || intolerancias.find(i => i.id === id)
    if (!moved) return

    if (preferencias.some(i => i.id === id)) {
      setPreferencias(prev => prev.filter(i => i.id !== id))
      setIntolerancias(prev => [...prev, moved])
    } else {
      setIntolerancias(prev => prev.filter(i => i.id !== id))
      setPreferencias(prev => [...prev, moved])
    }
  }

  const handleGuardar = async () => {
    try {
      await axios.post('/api/preferences', { intolerancias: intolerancias.map(i => i.id) })
      alert('Preferencias actualizadas correctamente.')
    } catch {
      alert('Error al guardar preferencias.')
    }
  }

  const handleReset = () => {
    setPreferencias([...ingredientesIniciales])
    setIntolerancias([])
  }

  if (status === 'loading' || loading) {
    return <p className="text-center mt-10">Cargando preferencias...</p>
  }

  if (status !== 'authenticated') return null

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">🍽️ Preferencias Alimentarias</h1>
      <p className="text-center text-gray-600 mb-10">Arrastra los ingredientes que no toleras al cuadro de intolerancias.</p>

      <div className="mt-10 mb-10 flex justify-center gap-4">
        <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
          Resetear preferencias
        </button>
        <button onClick={handleGuardar} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Guardar preferencias
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-green-900 mb-4">✅ Preferencias</h2>
            <SortableContext items={preferencias.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {preferencias.map(item => (
                  <SortableItem key={item.id} id={item.id} label={item.nombre} />
                ))}
              </ul>
            </SortableContext>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-red-700 mb-4">🚫 Intolerancias</h2>
            <SortableContext items={intolerancias.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {intolerancias.map(item => (
                  <SortableItem key={item.id} id={item.id} label={item.nombre} />
                ))}
              </ul>
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </>
  )
}
