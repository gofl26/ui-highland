import Header from '@/components/layouts/Header'
import { ToastProvider } from '@/components/commons/toast/ToastProvider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-[1340px]">
      <Header />
      <main>
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  )
}
