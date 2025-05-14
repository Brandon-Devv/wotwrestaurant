import Link from 'next/link'
import Image from 'next/image'

export default function DefaultNavbar() {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow">
      {/* Logo redondo a home */}
      <Link href="/">
        <Image
          src="/images/logoblanco.jpg"
          alt="Wonders Logo"
          width={40}
          height={40}
          className="rounded-full object-cover border border-white"
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
