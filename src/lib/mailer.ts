import nodemailer from 'nodemailer'

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error('Faltan EMAIL_USER o EMAIL_PASS en el entorno')
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  console.log(`Intentando enviar correo a: ${to}`)

  await transporter.sendMail({
    from: `"Wonders of the World Bogotá" <${EMAIL_USER}>`,
    to,
    subject,
    html,
    replyTo: EMAIL_USER,
  })

  console.log(`Correo enviado a ${to}`)
}
