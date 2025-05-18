import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

  // Extraer los ingredientes intolerantes
  const intolerancias = user.preferencias.map((p) => p.ingrediente)
  const intoleranciaIds = new Set(intolerancias.map((i) => i.id))

  // Obtener todos los ingredientes
  const todosLosIngredientes = await prisma.ingredient.findMany()

  // Filtrar los que NO están en la lista de intolerancias
  const preferencias = todosLosIngredientes.filter((i) => !intoleranciaIds.has(i.id))

  return NextResponse.json({ preferencias, intolerancias })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const { intolerancias }: { intolerancias: string[] } = await req.json()

  if (!Array.isArray(intolerancias)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  await prisma.preferencia.deleteMany({ where: { userId: user.id } })

  const nuevas = intolerancias.map((ingredienteId) => ({
    userId: user.id,
    ingredienteId,
  }))

  await prisma.preferencia.createMany({ data: nuevas })

  return NextResponse.json({ ok: true })
}
