'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'

export default function MiCuentaPage() {
  const { data: session } = useSession()
  const name = session?.user?.name ?? ''
  const email = session?.user?.email ?? ''

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    return regex.test(password)
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Todos los campos son obligatorios.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    if (!validatePassword(newPassword)) {
      setMessage(
        'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.'
      )
      return
    }

    try {
      await axios.post('/api/change-password', {
        currentPassword,
        newPassword,
      })
      setMessage('Contraseña actualizada correctamente ✅')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>
      if (err.response?.data?.error) {
        setMessage(err.response.data.error)
      } else {
        setMessage('Error al cambiar la contraseña ❌')
      }
    }
  }

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/fondovectores.png')" }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-md max-w-3xl mx-auto rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">👤 Mi Cuenta</h1>

        {/* Información personal */}
        <section className="mb-6 bg-white border rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">📋 Información personal</h2>
          <p><strong>Nombre:</strong> {name}</p>
          <p><strong>Correo:</strong> {email}</p>
        </section>

        {/* Cambio de contraseña */}
        <section className="mb-6 bg-white border rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">🔒 Cambiar contraseña</h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={handleChangePassword}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Cambiar contraseña
            </button>
            {message && <p className="text-sm text-red-600 mt-1">{message}</p>}
          </div>
        </section>

        {/* Preferencias */}
        <section className="mb-6 bg-white border rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">🥦 Preferencias alimentarias</h2>
          <Link
            href="/account/preferences"
            className="text-green-700 underline hover:text-green-800"
          >
            Ir a preferencias →
          </Link>
        </section>

        {/* Cerrar sesión */}
        <div className="text-center mt-6">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  )
}
