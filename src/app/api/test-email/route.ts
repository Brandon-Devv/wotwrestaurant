// src/app/api/test-email/route.ts
import { sendEmail } from '@/lib/mailer'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sendEmail({
      to: 'brandonst.avilaap@ecci.edu.co',
      subject: '📧 Test de correo',
      html: '<p>Correo de prueba enviado correctamente.</p>',
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Error enviando correo' }, { status: 500 })
  }
}
