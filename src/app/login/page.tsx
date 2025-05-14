'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email.length > 45) {
      setError('El correo electrónico no puede superar los 45 caracteres.')
      return
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Correo o contraseña incorrectos')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-green-100">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logoblanco.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full border border-gray-300 shadow"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Iniciar sesión
        </h1>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            maxLength={45}
            onChange={(e) => setEmail(e.target.value)}
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
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-md transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-green-700 font-medium cursor-pointer hover:underline"
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  )
}
