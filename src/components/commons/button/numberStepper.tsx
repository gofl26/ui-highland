'use client'
import { useState } from 'react'

interface props {
  value: number
  onChange: (newValue: number) => void
}
export default function NumberStepper({ value, onChange }: props) {
  const decrement = () => onChange(Math.max(value - 1, 0))
  const increment = () => onChange(value + 1)

  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 text-sm">
      <button
        className="flex size-10 items-center justify-center border-r border-gray-300"
        onClick={decrement}
      >
        –
      </button>
      <div className="w-12 text-center">{value}</div>
      <button
        className="flex size-10 items-center justify-center border-l border-gray-300"
        onClick={increment}
      >
        +
      </button>
    </div>
  )
}
