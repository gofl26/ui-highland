'use client'

import { useState } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function DefaultSelect({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}: SelectProps) {
  const [selected, setSelected] = useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm">{label}</label>}
      <select
        className={`border rounded p-2 text-sm focus:outline-none`}
        value={selected}
        onChange={handleChange}
        disabled={disabled}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
