import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import JotaiRootWrapper from '@/components/jotai/Jotai'
import { ToastProvider } from '@/components/commons/toast/ToastProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Apple Highland',
  description: 'Apple Highland',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased custom-scroll`}>
        <JotaiRootWrapper>
          <ToastProvider>{children}</ToastProvider>
        </JotaiRootWrapper>
      </body>
    </html>
  )
}
