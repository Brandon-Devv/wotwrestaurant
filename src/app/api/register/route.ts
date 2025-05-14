import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role: 'CLIENT',
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado en el servidor' },
      { status: 500 }
    )
  }
}
