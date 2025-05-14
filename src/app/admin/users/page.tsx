'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name?: string
  email: string
  role: 'ADMIN' | 'CLIENT'
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string>('')

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data: User[] | { error: string } = await res.json()

      if (!res.ok || 'error' in data) {
        setError('error' in data ? data.error : 'Error al cargar usuarios')
      } else {
        setUsers(data)
      }
    } catch (err) {
      console.error('Error en fetchUsers:', err)
      setError('Error inesperado al obtener usuarios')
    }
  }

  const changeRole = async (id: string, newRole: 'ADMIN' | 'CLIENT') => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, role: newRole }),
      })

      if (res.ok) {
        fetchUsers()
      } else {
        alert('Error al actualizar rol')
      }
    } catch (err) {
      console.error('Error de red al actualizar rol:', err)
      alert('Error de red al actualizar rol')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">👥 Gestión de Usuarios</h1>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      <div className="bg-white rounded shadow border p-4 overflow-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nombre</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name || 'Sin nombre'}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      changeRole(u.id, e.target.value as 'ADMIN' | 'CLIENT')
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
