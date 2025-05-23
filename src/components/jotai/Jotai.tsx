'use client'
import { Provider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
export default function RecoilRootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider>{children}</Provider>
    </SessionProvider>
  )
}
