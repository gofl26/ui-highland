'use client'

import { useEffect, useState } from 'react'

export default function ErrorToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-24 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg text-sm animate-slide-in">
      {message}
    </div>
  )
}
