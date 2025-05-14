// ✅ Archivo: src/app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Extraer ID desde la URL
  const id = req.nextUrl.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
  }

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
    console.error('❌ Error al actualizar producto:', error)
    return NextResponse.json(
      { error: 'No se pudo actualizar el producto' },
      { status: 500 }
    )
  }
}
