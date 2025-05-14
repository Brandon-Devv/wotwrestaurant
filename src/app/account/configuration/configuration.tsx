'use client'
import { useSession } from 'next-auth/react'

export default function Configuration() {
  const { data: session } = useSession()

  return (
    <div>
      <p><strong>Nombre:</strong> {session?.user?.name}</p>
      <p><strong>Correo:</strong> {session?.user?.email}</p>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Actualizar contraseña</h2>
        <input type="password" placeholder="Nueva contraseña" className="border px-3 py-2 mr-2" />
        <button className="bg-blue-600 text-white px-4 py-2">Actualizar</button>
      </div>
    </div>
  )
}
