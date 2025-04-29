'use client'

import { useRouter } from 'next/navigation'
import { signOutWithForm } from '@/serverActions/auth'

export default function SessionButtons({ token }: { token: any }) {
  const router = useRouter()

  if (token) {
    return <button onClick={signOutWithForm}>로그아웃</button>
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
