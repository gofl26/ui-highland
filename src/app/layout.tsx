import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { ToastProvider } from '@/components/commons/toast/ToastProvider'
import JotaiRootWrapper from '@/components/jotai/Jotai'

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
      <body className={`${geistSans.variable} ${geistMono.variable} custom-scroll antialiased`}>
        <JotaiRootWrapper>
          <ToastProvider>{children}</ToastProvider>
        </JotaiRootWrapper>
      </body>
    </html>
  )
}
