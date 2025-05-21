'use client'
import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  children: ReactNode
}

export default function CreateInquiryModal({ isOpen, onClose, onSave, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col w-full h-[500px] bg-white rounded-lg shadow-lg max-w-2xl mx-4 p-6">
        <div className="flex flex-col flex-1 w-full items-center overflow-y-auto custom-scroll">
          {children}
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <button className="border border-borderDefault px-3 py-1 rounded-lg" onClick={onClose}>
            취소
          </button>
          <button className="bg-bgPrimary text-textPrimary px-3 py-1 rounded-lg" onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
