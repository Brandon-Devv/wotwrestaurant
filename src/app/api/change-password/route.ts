import { hash, compare } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Error al interpretar el JSON' }, { status: 400 })
  }

  const currentPassword = body?.currentPassword
  const newPassword = body?.newPassword

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const passwordCorrect = await compare(currentPassword, user.password)
  if (!passwordCorrect) {
    return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 403 })
  }

  const policyRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
  if (!policyRegex.test(newPassword)) {
    return NextResponse.json({
      error: 'La nueva contraseña no cumple con los requisitos de seguridad.',
    }, { status: 422 })
  }

  const hashedPassword = await hash(newPassword, 10)

  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  })

  // ✅ Enviar correo de confirmación
  try {
    await sendEmail({
      to: session.user.email,
      subject: 'Confirmación de cambio de contraseña',
      html: `
        <p><strong>Hola ${user.name || 'usuario'},</strong></p>
        <p>Te confirmamos que tu contraseña fue actualizada correctamente en <strong>Wonders Of The World Bogotá</strong>.</p>
        <p>Si no realizaste este cambio, comunícate de inmediato con nuestro equipo de soporte.</p>
        <br/>
        <p>Gracias por confiar en nosotros.</p>
        <p>🍽️ Wonders Of The World Bogotá</p>
      `,
    })
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error)
    // No fallar el flujo si el correo no se envía, solo loguear el error
  }

  return NextResponse.json({ ok: true })
}
