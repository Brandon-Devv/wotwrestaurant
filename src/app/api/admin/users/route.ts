import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users - Listar usuarios
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PATCH /api/admin/users - Cambiar rol
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { userId, role } = await req.json()

    if (
      typeof userId !== 'string' ||
      !['ADMIN', 'CLIENT'].includes(role)
    ) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    return NextResponse.json({ message: 'Rol actualizado', user: updated })
  } catch (error) {
    console.error('Error al actualizar rol:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
