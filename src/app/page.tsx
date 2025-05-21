'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const goToPanel = () => {
    if (session?.user?.role === 'ADMIN') router.push('/admin')
    else if (session?.user?.role === 'CLIENT') router.push('/client')
  }

  return (
    <main className="relative min-h-screen bg-gray-900 text-white">
      {/* Fondo con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/fondoprinci.png')" }}
      />
      <div className="absolute inset-0 bg-black opacity-60 z-0" />

      {/* Contenido */}
      <div className="relative z-10 px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Título principal */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 drop-shadow-md animate-fade-in">
          Wonders Of The World Bogotá
        </h2>

        {/* Presentación */}
        <div className="bg-white bg-opacity-90 text-gray-900 max-w-3xl rounded-xl p-8 shadow-xl text-center mb-10 animate-slide-up">
          <h2 className="text-2xl font-semibold mb-4">¿Quiénes somos?</h2>
          <p className="mb-6">
            Wonders Of The World Bogotá es un restaurante innovador ubicado en la Calle 123 #45-67, especializado en cocina británica con opciones veganas y no veganas. Nuestro sistema permite a cada cliente personalizar su experiencia alimentaria mediante la configuración de preferencias e intolerancias, filtrando automáticamente los platos que contienen ingredientes no deseados. Gracias a un modelo de trazabilidad integral, garantizamos transparencia en la composición de cada plato, adaptándonos a las necesidades, gustos y restricciones de cada comensal.
          </p>


          {session?.user ? (
            <button
              onClick={goToPanel}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
            >
              Ir a mi panel
            </button>
          ) : (
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <button
                onClick={() => router.push('/login')}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-md hover:bg-green-100 transition duration-300"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="bg-white bg-opacity-90 text-gray-900 max-w-3xl rounded-xl p-8 shadow-xl text-center animate-slide-up">
          <h3 className="text-xl font-semibold mb-2">📍 Ubicación</h3>
          <p className="mb-4">Calle 123 #45-67, Bogotá D.C., Colombia</p>

          <h3 className="text-xl font-semibold mb-2">📞 Contáctanos</h3>
          <p className="mb-1">Email: wotwrestaurantbog@gmail.com</p>
          <p>Teléfono: +57 3194556973</p>
        </div>
      </div>
    </main>
  )
}
