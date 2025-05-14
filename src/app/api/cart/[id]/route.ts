import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Extraer el ID del producto desde la URL
  const id = req.nextUrl.pathname.split('/').pop()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    await prisma.carrito.delete({
      where: {
        userId_productoId: {
          userId: user.id,
          productoId: id,
        },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error al eliminar del carrito:', error)
    return NextResponse.json({ error: 'Error al eliminar del carrito' }, { status: 500 })
  }
}
