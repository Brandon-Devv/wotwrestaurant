import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const url = req.nextUrl
  const id = url.pathname.split('/').pop()  // Extrae el ID desde la ruta

  if (!id) {
    return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
  }

  const body = await req.json()

  const updated = await prisma.ingredient.update({
    where: { id },
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

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const url = req.nextUrl
  const id = url.pathname.split('/').pop()  // Extrae el ID desde la ruta

  if (!id) {
    return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
  }

  try {
    await prisma.preferencia.deleteMany({ where: { ingredienteId: id } })
    await prisma.productIngredient.deleteMany({ where: { ingredienteId: id } })
    await prisma.ingredient.delete({ where: { id } })

    return NextResponse.json({ message: 'Ingrediente eliminado' })
  } catch (error) {
    console.error('❌ Error al eliminar ingrediente:', error)
    return NextResponse.json(
      { error: 'No se pudo eliminar el ingrediente' },
      { status: 500 }
    )
  }
}
