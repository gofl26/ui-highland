'use client'

import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
export default function SuccessToast({ message }: { message: string[] }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])
  if (!visible) return null
  //
  return (
    <div className="fixed right-10 top-24 z-50 animate-slide-in gap-4 rounded bg-green-500 px-4 py-2 text-sm shadow-lg">
      {message.map((msg, index) => (
        <p key={index} className="flex items-center gap-2 text-white">
          <TriangleAlert size="16" />
          {msg}
        </p>
      ))}
    </div>
  )
}
