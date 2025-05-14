import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(request.url)
  const tipoParam = searchParams.get('tipo')
  const vegano = searchParams.get('vegano')

  const tipoMap = {
    'Almuerzo': 'ALMUERZO',
    'Cena': 'CENA',
    'Comida Rápida': 'COMIDA_RAPIDA',
  } as const

  const whereClause: Prisma.ProductWhereInput = {
    stock: {
      gt: 0,
    },
  }

  if (tipoParam && tipoMap[tipoParam as keyof typeof tipoMap]) {
    whereClause.tipo = tipoMap[tipoParam as keyof typeof tipoMap]
  }

  if (vegano === 'true') {
    whereClause.vegano = true
  } else if (vegano === 'false') {
    whereClause.vegano = false
  }

  const productos = await prisma.product.findMany({
    where: whereClause,
    include: {
      ingredientes: {
        include: {
          ingrediente: true,
        },
      },
    },
  })

  if (!session) {
    return NextResponse.json({ preferidos: productos, restringidos: [] })
  }

  const usuario = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      preferencias: {
        include: {
          ingrediente: true,
        },
      },
    },
  })

  if (!usuario) {
    return NextResponse.json({ preferidos: productos, restringidos: [] })
  }

  const listaNegra = usuario.preferencias.map((p) => p.ingrediente.nombre)

  const preferidos = productos.filter((producto) =>
    producto.ingredientes.every((i) => !listaNegra.includes(i.ingrediente.nombre))
  )

  const restringidos = productos.filter((producto) =>
    producto.ingredientes.some((i) => listaNegra.includes(i.ingrediente.nombre))
  )

  return NextResponse.json({ preferidos, restringidos })
}
