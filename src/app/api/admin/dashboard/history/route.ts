import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let where = {}

  if (startDate && endDate) {
    where = {
      fecha: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }
  }

  const pedidos = await prisma.pedido.findMany({
    where,
    orderBy: { fecha: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          producto: { select: { nombre: true } },
        },
      },
    },
  })

  const resultado = pedidos.map((pedido) => ({
    id: pedido.id,
    fecha: pedido.fecha,
    total: pedido.total,
    usuario: pedido.user.name || pedido.user.email,
    productos: pedido.items.map((item) => ({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
    })),
  }))

  return NextResponse.json(resultado)
}
