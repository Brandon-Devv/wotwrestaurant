import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const { items, total } = body

  if (!Array.isArray(items) || typeof total !== 'number') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Validar stock antes de registrar el pedido
    for (const item of items) {
      const producto = await prisma.product.findUnique({
        where: { id: item.id },
      })

      if (!producto || producto.stock < item.cantidad) {
        return NextResponse.json({
          error: `Stock insuficiente para el producto "${item.nombre || 'desconocido'}"`,
        }, { status: 400 })
      }
    }

    // Crear el pedido
    const pedido = await prisma.pedido.create({
      data: {
        userId: user.id,
        total,
        fecha: new Date(),
        items: {
          create: items.map((item: any) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          })),
        },
      },
    })

    // Actualizar stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      })
    }

    return NextResponse.json({ ok: true, pedidoId: pedido.id })
  } catch (error) {
    console.error('Error al registrar pedido:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
