'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', type, ...rest } = props
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordType = type === 'password'
  const inputType = isPasswordType && showPassword ? 'text' : type

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        className={`w-full border rounded-lg border-borderDefault p-2 pr-10 focus:outline-inputFocus ${className}`}
        {...rest}
      />
      {isPasswordType && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  )
}
