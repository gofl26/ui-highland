import Header from '@/components/layouts/Header'
import ManageSideBar from '@/components/layouts/ManageSideBar'

export default function Products({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* 고정 사이드바 */}
        <ManageSideBar />
        {/* 스크롤 되는 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
