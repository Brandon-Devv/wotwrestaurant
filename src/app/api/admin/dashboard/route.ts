// src/app/api/admin/dashboard/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { subDays, startOfDay } from 'date-fns'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const today = startOfDay(new Date())
  const last7 = subDays(today, 7)
  const last30 = subDays(today, 30)

  const [hoy, semana, mes] = await Promise.all([
    prisma.itemPedido.aggregate({
      _sum: { subtotal: true },
      where: { pedido: { fecha: { gte: today } } },
    }),
    prisma.itemPedido.aggregate({
      _sum: { subtotal: true },
      where: { pedido: { fecha: { gte: last7 } } },
    }),
    prisma.itemPedido.aggregate({
      _sum: { subtotal: true },
      where: { pedido: { fecha: { gte: last30 } } },
    }),
  ])

  return NextResponse.json({
    hoy: hoy._sum.subtotal || 0,
    semana: semana._sum.subtotal || 0,
    mes: mes._sum.subtotal || 0,
  })
}
