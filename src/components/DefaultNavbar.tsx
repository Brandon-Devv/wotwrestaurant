import Link from 'next/link'

export default function DefaultNavbar() {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow">
      {/* Logo redondo a home */}
      <Link href="/">
        <img
          src="/images/logoblanco.jpg"
          alt="Wonders Logo"
          className="h-10 w-10 rounded-full object-cover border border-white"
        />
      </Link>

      <div className="space-x-4">
        <Link href="/menu" className="hover:underline">Menú</Link>
        <Link href="/login" className="hover:underline">Iniciar sesión</Link>
        <Link href="/register" className="hover:underline">Registrarse</Link>
      </div>
    </nav>
  )
}
