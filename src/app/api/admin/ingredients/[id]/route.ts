import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ✅ CORRECTA FIRMA PARA APP ROUTER
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()
  const updated = await prisma.ingredient.update({
    where: { id: context.params.id },
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
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const ingredienteId = context.params.id

  try {
    await prisma.preferencia.deleteMany({ where: { ingredienteId } })
    await prisma.productIngredient.deleteMany({ where: { ingredienteId } })
    await prisma.ingredient.delete({ where: { id: ingredienteId } })

    return NextResponse.json({ message: 'Ingrediente eliminado' })
  } catch (error) {
    console.error('❌ Error al eliminar ingrediente:', error)
    return NextResponse.json(
      { error: 'No se pudo eliminar el ingrediente' },
      { status: 500 }
    )
  }
}
