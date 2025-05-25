import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import PageWrapper from '@/components/PageWrapper'
import BackgroundWrapper from '@/components/BackgroundWrapper'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wonders Of The World',
  description: 'Restaurante vegano y saludable',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <PageWrapper>
            <BackgroundWrapper>{children}</BackgroundWrapper>
          </PageWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
