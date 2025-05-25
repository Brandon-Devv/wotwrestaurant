'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'

interface ChangePasswordResponse {
  error?: string
}

export default function MiCuentaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="p-6 text-center">Cargando sesión...</div>
  }

  if (!session) return null

  const name = session.user.name ?? ''
  const email = session.user.email ?? ''
  const phone = session.user.phone ?? ''

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    return regex.test(password)
  }

  const handleChangePassword = async () => {
    setMessage('')
    setSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Todos los campos son obligatorios.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    if (!validatePassword(newPassword)) {
      setMessage('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.')
      return
    }

    try {
      await axios.post('/api/change-password', {
        currentPassword,
        newPassword,
      })
      setSuccess(true)
      setMessage('Contraseña actualizada correctamente ✅')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      const err = error as AxiosError<ChangePasswordResponse>
      const mensaje = err.response?.data?.error ?? 'Error al cambiar la contraseña ❌'
      setMessage(mensaje)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">👤 Mi Cuenta</h1>

      {/* Información personal */}
      <section className="mb-6 bg-white border rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">📋 Información personal</h2>
        <p><strong>Nombre:</strong> {name}</p>
        <p><strong>Correo:</strong> {email}</p>
        <p><strong>Teléfono:</strong> {phone}</p>
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
          {message && (
            <p className={`text-sm mt-1 ${success ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
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
  )
}
