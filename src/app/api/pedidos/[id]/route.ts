import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Extraer el ID desde la URL
  const id = req.nextUrl.pathname.split('/').pop()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID no proporcionado o inválido' }, { status: 400 })
  }

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
        user: true,
      },
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('❌ Error al obtener pedido:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
