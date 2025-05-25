'use client'

import { useEffect, useState } from 'react'

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
  const [mensaje, setMensaje] = useState<string>('')
  const [esExito, setEsExito] = useState<boolean>(false)

  const fetchIngredientes = async () => {
    const res = await fetch('/api/admin/ingredients')
    const data: Ingredient[] = await res.json()
    setIngredients(data)
  }

  useEffect(() => {
    fetchIngredientes()
  }, [])

  const sanitize = (name: string, value: string) => {
    switch (name) {
      case 'nombre':
      case 'origen':
      case 'tipoAlimento':
      case 'proveedor':
        return value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ ]/g, '').slice(0, 50)
      case 'lote':
        return value.replace(/[^A-Za-z0-9\-]/g, '').slice(0, 30)
      case 'registro':
        return value.replace(/[^A-Za-z0-9._-]/g, '').slice(0, 40)
      default:
        return value
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const inputName = name as keyof Ingredient
    setForm(prev => ({
      ...prev,
      [inputName]: type === 'checkbox' ? checked : sanitize(name, value),
    }))
  }

  const handleSubmit = async () => {
    setMensaje('')
    setEsExito(false)

    const url = editId
      ? `/api/admin/ingredients/${editId}`
      : '/api/admin/ingredients'
    const method = editId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al guardar')
        setEsExito(false)
        return
      }

      setMensaje(editId ? 'Ingrediente actualizado correctamente ✅' : 'Ingrediente guardado correctamente ✅')
      setEsExito(true)
      setEditId(null)
      setForm({})
      await fetchIngredientes()
    } catch {
      setMensaje('Error inesperado al enviar el formulario.')
      setEsExito(false)
    }
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
    <>
      <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
        🧪 Matriz de Trazabilidad
      </h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {(['nombre', 'origen', 'tipoAlimento', 'proveedor', 'lote', 'registro'] as const).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={typeof form[field] === 'string' ? form[field] : ''}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
          ))}

          <input
            type="date"
            name="fechaIngreso"
            min="2024-01-01"
            value={form.fechaIngreso || ''}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="fechaCaducidad"
            min="2024-01-01"
            value={form.fechaCaducidad || ''}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <label className="col-span-2 inline-flex items-center mt-2">
            <input
              type="checkbox"
              name="aptoVegano"
              checked={form.aptoVegano ?? false}
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

        {mensaje && (
          <p className={`mt-4 font-semibold px-3 py-2 rounded ${esExito ? 'bg-green-100 text-green-700 border border-green-300' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </section>

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
                <th className="p-2">Lote</th>
                <th className="p-2">Registro</th>
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
                  <td className="p-2">{i.lote}</td>
                  <td className="p-2">{i.registro}</td>
                  <td className="p-2">{i.fechaIngreso?.slice(0, 10)}</td>
                  <td className="p-2">{i.fechaCaducidad?.slice(0, 10)}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(i.id, i.nombre)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
