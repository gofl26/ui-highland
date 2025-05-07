import Header from '@/components/layouts/Header'

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <main>{children}</main>
    </div>
  )
}
