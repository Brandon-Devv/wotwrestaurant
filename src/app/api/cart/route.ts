// ✅ Archivo: src/app/api/cart/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json([], { status: 200 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      carrito: {
        include: { producto: true },
      },
    },
  })

  return NextResponse.json(user?.carrito || [])
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const data = await req.json()
  const { productoId, cantidad, precioUnitario } = data

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user)
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const existing = await prisma.carrito.findUnique({
    where: {
      userId_productoId: {
        userId: user.id,
        productoId,
      },
    },
  })

  if (existing) {
    await prisma.carrito.update({
      where: {
        userId_productoId: {
          userId: user.id,
          productoId,
        },
      },
      data: {
        cantidad: existing.cantidad + cantidad,
      },
    })
  } else {
    await prisma.carrito.create({
      data: {
        userId: user.id,
        productoId,
        cantidad,
        precioUnitario,
      },
    })
  }

  // ✅ Devolver carrito actualizado
  const updatedCart = await prisma.carrito.findMany({
    where: { userId: user.id },
    include: { producto: true },
  })

  return NextResponse.json(updatedCart)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { productoId, cantidad } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user)
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const updated = await prisma.carrito.update({
    where: {
      userId_productoId: {
        userId: user.id,
        productoId,
      },
    },
    data: { cantidad },
  })

  return NextResponse.json(updated)
}
