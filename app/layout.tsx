import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GST Invoice Generator',
  description: 'Create, manage, and print professional GST tax invoices quickly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 print:bg-white min-h-screen`}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
