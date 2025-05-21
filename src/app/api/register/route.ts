import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { sendEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  try {
    const { email, name, password, phone } = await request.json()

    if (!email || !name || !password || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          error: 'Formato de teléfono inválido. Usa el formato internacional. Ej: +573001234567',
        },
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

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
        role: 'CLIENT',
      },
    })

    try {
      console.log('📩 Intentando enviar correo a:', email)

      await sendEmail({
        to: email,
        subject: '🎉 Bienvenido a Wonders Of The World Bogotá',
        html: `
          <h2>¡Hola ${name}!</h2>
          <p>Gracias por registrarte en <strong>Wonders Of The World Bogotá</strong>.</p>
          <p>Ya puedes iniciar sesión, navegar nuestro menú y hacer tus pedidos.</p>
          <p><strong>Teléfono registrado:</strong> ${phone}</p>
          <br/>
          <p>🍽️ ¡Te esperamos!</p>
        `,
      })

      console.log('✅ Correo enviado exitosamente a:', email)
    } catch (correoError) {
      console.error('❌ Error al enviar correo de bienvenida:', correoError)
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('❌ Error en el registro:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado en el servidor' },
      { status: 500 }
    )
  }
}
