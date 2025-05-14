import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener preferencias e intolerancias
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      preferencias: {
        include: { ingrediente: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  if (user.role === 'ADMIN') {
    return NextResponse.json({ preferencias: [], intolerancias: [] })
  }

  const ingredientes = await prisma.ingredient.findMany()
  const intolerancias = user.preferencias.map((p) => p.ingrediente.nombre)
  const preferencias = ingredientes.filter((i) => !intolerancias.includes(i.nombre))

  return NextResponse.json({ preferencias, intolerancias })
}

// POST - Guardar intolerancias alimentarias
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  if (user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Los administradores no tienen preferencias' }, { status: 403 })
  }

  const { intolerancias }: { intolerancias: string[] } = await req.json()

  if (!Array.isArray(intolerancias)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  await prisma.preferencia.deleteMany({ where: { userId: user.id } })

  const ingredientes = await prisma.ingredient.findMany({
    where: { nombre: { in: intolerancias } },
  })

  const nuevaLista = ingredientes.map((i) => ({
    userId: user.id,
    ingredienteId: i.id,
  }))

  await prisma.preferencia.createMany({ data: nuevaLista })

  return NextResponse.json({ ok: true })
}
