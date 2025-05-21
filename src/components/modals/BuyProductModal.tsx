'use client'
import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function BuyProductModal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col w-full h-[400px] bg-white rounded-lg shadow-lg max-w-3xl mx-4 p-6">
        <div className="flex justify-end">
          <button onClick={() => onClose()}>
            <X />
          </button>
        </div>
        <div className="flex flex-col flex-1 w-full mt-4 px-8 overflow-y-auto custom-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}
