'use client'

import { useEffect, useState } from 'react'

export default function ToastItem({
  message,
  type = 'info',
}: {
  message: string
  type?: 'success' | 'error' | 'info'
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 애니메이션으로 나타남
    const show = setTimeout(() => setVisible(true), 10)
    // 사라지는 애니메이션 시작 (300ms 전에 opacity 제거)
    const hide = setTimeout(() => setVisible(false), 3000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div
      className={`
        rounded px-4 py-2 text-white shadow transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0'}
        ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-gray-700'}
      `}
    >
      {message}
    </div>
  )
}
