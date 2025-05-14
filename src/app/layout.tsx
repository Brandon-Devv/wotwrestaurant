import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'
import PageWrapper from '@/components/PageWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Wonders Of The World",
  description: "Restaurante vegano y saludable",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <PageWrapper>
            {children}
          </PageWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
