'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import ToastItem from './ToastItem'
type Toast = {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
}

type ToastContextType = {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type?: Toast['type']) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-40 right-4 space-y-2 z-50">
        {toasts.map(({ id, message, type }) => (
          <ToastItem key={id} message={message} type={type} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
