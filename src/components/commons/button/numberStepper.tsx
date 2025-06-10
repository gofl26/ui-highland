'use client'
import { useState } from 'react'

interface props {
  value: number
}
export default function NumberStepper({ value }: props) {
  const [_value, setValue] = useState(value)

  const decrement = () => setValue((prev) => Math.max(prev - 1, 1))
  const increment = () => setValue((prev) => prev + 1)

  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 text-sm">
      <button
        className="flex size-10 items-center justify-center border-r border-gray-300 hover:bg-gray-100"
        onClick={decrement}
      >
        –
      </button>
      <div className="w-12 text-center">{_value}</div>
      <button
        className="flex size-10 items-center justify-center border-l border-gray-300 hover:bg-gray-100"
        onClick={increment}
      >
        +
      </button>
    </div>
  )
}
