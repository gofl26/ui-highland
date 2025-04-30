'use client'

import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
export default function ErrorToast({ message }: { message: string[] }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null
  //
  return (
    <div className="fixed top-24 right-10 z-50 bg-red-500 px-4 py-2 gap-4 rounded shadow-lg text-sm animate-slide-in">
      {message.map((msg, index) => (
        <p key={index} className="flex gap-2 items-center text-white">
          <TriangleAlert size="16" />
          {msg}
        </p>
      ))}
    </div>
  )
}
