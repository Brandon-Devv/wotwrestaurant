'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Ingredient {
  id: string
  nombre: string
  aptoVegano: boolean
  origen: string
  tipoAlimento: string
  proveedor: string
  lote: string
  registro: string
  fechaIngreso: string
  fechaCaducidad: string
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [form, setForm] = useState<Partial<Ingredient>>({})
  const [editId, setEditId] = useState<string | null>(null)
  const router = useRouter()

  const fetchIngredientes = async () => {
    const res = await fetch('/api/admin/ingredients')
    const data = await res.json()
    setIngredients(data)
  }

  useEffect(() => {
    fetchIngredientes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`/api/admin/ingredients/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/admin/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setEditId(null)
    setForm({})
    await fetchIngredientes()
  }

  const handleEdit = (ingredient: Ingredient) => {
    setForm(ingredient)
    setEditId(ingredient.id)
  }

  const handleDelete = async (id: string, nombre: string) => {
    const confirmar = confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)
    if (!confirmar) return
    await fetch(`/api/admin/ingredients/${id}`, { method: 'DELETE' })
    await fetchIngredientes()
  }

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-6xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">🧪 Matriz de Trazabilidad</h1>

        {/* Formulario */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'nombre', 'origen', 'tipoAlimento', 'proveedor', 'lote', 'registro'
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(form as any)[field] || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            ))}
            <input
              type="date"
              name="fechaIngreso"
              value={form.fechaIngreso || ''}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="fechaCaducidad"
              value={form.fechaCaducidad || ''}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <label className="col-span-2 inline-flex items-center mt-2">
              <input
                type="checkbox"
                name="aptoVegano"
                checked={form.aptoVegano || false}
                onChange={handleChange}
                className="mr-2"
              />
              Apto Vegano
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editId ? 'Actualizar' : 'Guardar'}
          </button>
        </section>

        {/* Tabla de Ingredientes */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lista de Ingredientes</h2>
            <button
              onClick={fetchIngredientes}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            >
              Actualizar 🔄
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100 text-sm font-semibold">
                <tr>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Vegano</th>
                  <th className="p-2">Origen</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Proveedor</th>
                  <th className="p-2">Ingreso</th>
                  <th className="p-2">Caducidad</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map(i => (
                  <tr key={i.id} className="border-t text-sm">
                    <td className="p-2">{i.nombre}</td>
                    <td className="p-2">{i.aptoVegano ? 'Sí' : 'No'}</td>
                    <td className="p-2">{i.origen}</td>
                    <td className="p-2">{i.tipoAlimento}</td>
                    <td className="p-2">{i.proveedor}</td>
                    <td className="p-2">{i.fechaIngreso?.slice(0, 10)}</td>
                    <td className="p-2">{i.fechaCaducidad?.slice(0, 10)}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(i)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                      <button onClick={() => handleDelete(i.id, i.nombre)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
