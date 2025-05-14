import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const productos = await prisma.product.findMany({
    include: {
      ingredientes: {
        include: {
          ingrediente: true,
        },
      },
    },
  })

  return NextResponse.json(productos)
}
