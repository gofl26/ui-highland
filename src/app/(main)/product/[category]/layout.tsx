import Header from '@/components/layouts/Header'

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <main>{children}</main>
    </div>
  )
}
