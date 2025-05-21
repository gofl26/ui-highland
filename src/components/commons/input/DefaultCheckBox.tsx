'use client'

import { useId } from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const id = useId()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-textDefault rounded border border-borderPrimary cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  )
}
