import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const ingredientes = await prisma.ingredient.findMany()
  return NextResponse.json(ingredientes)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()

  const nuevo = await prisma.ingredient.create({
    data: {
      nombre: body.nombre,
      aptoVegano: body.aptoVegano,
      origen: body.origen,
      tipoAlimento: body.tipoAlimento,
      proveedor: body.proveedor,
      lote: body.lote,
      registro: body.registro,
      fechaIngreso: new Date(body.fechaIngreso),
      fechaCaducidad: new Date(body.fechaCaducidad),
    },
  })

  return NextResponse.json(nuevo)
}
