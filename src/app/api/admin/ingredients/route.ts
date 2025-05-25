import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

  try {
    const body = await req.json()

    // Sanitizar campos string
    const data = {
      nombre: body.nombre?.trim(),
      aptoVegano: body.aptoVegano,
      origen: body.origen?.trim(),
      tipoAlimento: body.tipoAlimento?.trim(),
      proveedor: body.proveedor?.trim(),
      lote: body.lote?.trim(),
      registro: body.registro?.trim(),
      fechaIngreso: new Date(body.fechaIngreso),
      fechaCaducidad: new Date(body.fechaCaducidad),
    }

    // Validación mínima de campos obligatorios
    if (!data.nombre || !data.origen || !data.tipoAlimento || !data.proveedor) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400 }
      )
    }

    const nuevo = await prisma.ingredient.create({ data })
    return NextResponse.json(nuevo)

  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ya existe un ingrediente con ese nombre.' },
        { status: 400 }
      )
    }

    console.error('Error al crear ingrediente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
