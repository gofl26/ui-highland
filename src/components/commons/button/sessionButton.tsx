'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOutWithForm } from '@/serverActions/auth'

export default function SessionButtons({ token }: { token: any }) {
  const { data: session } = useSession()
  const [loginState, setLoginState] = useState(token)
  const router = useRouter()
  const handleClickLogout = async () => {
    if (!session?.sessionId) return
    const result = await signOutWithForm({ sessionId: session.sessionId })
    if (result) setLoginState(undefined)
  }
  if (loginState) {
    return <button onClick={handleClickLogout}>로그아웃</button>
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          router.push('/login')
        }}
      >
        로그인
      </button>
      <button
        onClick={() => {
          router.push('/signup')
        }}
      >
        회원가입
      </button>
    </div>
  )
}
