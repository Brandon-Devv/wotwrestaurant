// ✅ Archivo: src/app/api/admin/products/[id]/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = context.params
  const data = await req.json()

  try {
    const actualizado = await prisma.product.update({
      where: { id },
      data: {
        precio: data.precio,
        stock: data.stock,
      },
    })

    return NextResponse.json(actualizado)
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el producto' }, { status: 500 })
  }
}
