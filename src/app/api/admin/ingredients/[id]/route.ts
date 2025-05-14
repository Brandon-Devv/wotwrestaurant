import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()

  const updated = await prisma.ingredient.update({
    where: { id: params.id },
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const ingredienteId = params.id

  try {
    // Primero eliminamos todas las referencias en Preferencia
    await prisma.preferencia.deleteMany({
      where: { ingredienteId },
    })

    // Luego en ProductIngredient
    await prisma.productIngredient.deleteMany({
      where: { ingredienteId },
    })

    // Finalmente, eliminamos el ingrediente
    await prisma.ingredient.delete({
      where: { id: ingredienteId },
    })

    return NextResponse.json({ message: 'Ingrediente eliminado' })
  } catch (error) {
    console.error('❌ Error al eliminar ingrediente:', error)
    return NextResponse.json(
      { error: 'No se pudo eliminar el ingrediente' },
      { status: 500 }
    )
  }
}
