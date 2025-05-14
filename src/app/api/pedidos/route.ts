import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface PedidoItem {
  id: string
  cantidad: number
  subtotal: number
  nombre?: string
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { items, total } = body as {
    items: PedidoItem[]
    total: number
  }

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

    for (const item of items) {
      if (
        typeof item.id !== 'string' ||
        typeof item.cantidad !== 'number' ||
        typeof item.subtotal !== 'number'
      ) {
        return NextResponse.json({ error: 'Estructura de item inválida' }, { status: 400 })
      }

      const producto = await prisma.product.findUnique({
        where: { id: item.id },
      })

      if (!producto || producto.stock < item.cantidad) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para el producto "${item.nombre || 'desconocido'}"`,
          },
          { status: 400 }
        )
      }
    }

    const pedido = await prisma.pedido.create({
      data: {
        userId: user.id,
        total,
        fecha: new Date(),
        items: {
          create: items.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          })),
        },
      },
    })

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
  } catch (error: unknown) {
    console.error('Error al registrar pedido:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
