'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const validatePassword = (pass: string) => {
    const policy = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/
    return policy.test(pass)
  }

  const validateName = (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,35}$/.test(name)
  const validateEmail = (email: string) => email.length <= 35
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateName(name)) {
      setError('El nombre solo puede contener letras y espacios, máximo 35 caracteres.')
      return
    }

    if (!validateEmail(email)) {
      setError('El correo electrónico no debe exceder los 35 caracteres.')
      return
    }

    if (!validatePhone(phone)) {
      setError('El número de teléfono debe ser válido. Usa el formato internacional. Ej: +573001234567')
      return
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.')
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          password, // ✅ ENVIAR LA CONTRASEÑA EN TEXTO PLANO
          phone,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error en el registro')
      } else {
        router.push('/login')
      }
    } catch (e) {
      console.error(e)
      setError('Error inesperado del servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-green-100">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logoblanco.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full border border-gray-300 shadow"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            maxLength={35}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            maxLength={35}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="tel"
            placeholder="Número de teléfono (Ej: +573001234567)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            minLength={8}
            maxLength={64}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-green-700 font-medium cursor-pointer hover:underline"
          >
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  )
}
