'use client'
import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function InfomationModal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 flex h-[250px] w-full max-w-xl flex-col rounded-lg bg-white p-6 shadow-lg">
        <div className="custom-scroll flex w-full flex-1 flex-col overflow-y-auto">{children}</div>
        <div className="mt-4 flex justify-center gap-4">
          <button className="rounded-lg border border-borderDefault px-3 py-1" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
