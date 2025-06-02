'use client'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function BuyProductModal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="mx-4 flex h-[400px] w-full max-w-3xl flex-col rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-end">
          <button onClick={() => onClose()}>
            <X />
          </button>
        </div>
        <div className="custom-scroll mt-4 flex w-full flex-1 flex-col overflow-y-auto px-8">
          {children}
        </div>
      </div>
    </div>
  )
}
