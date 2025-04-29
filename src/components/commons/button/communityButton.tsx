'use client'

import { useRouter } from 'next/navigation'

export default function CommunityButtons() {
  const router = useRouter()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          router.push('/comunity')
        }}
      >
        공지사항
      </button>
      <button
        onClick={() => {
          router.push('/comunity')
        }}
      >
        고객센터
      </button>
    </div>
  )
}
