import Header from '@/components/layouts/Header'
import ManageSideBar from '@/components/layouts/ManageSideBar'

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-[1340px] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* 고정 사이드바 */}
        <ManageSideBar />
        {/* 스크롤 되는 콘텐츠 */}
        <main className="flex-1 overflow-y-auto custom-scroll">{children}</main>
      </div>
    </div>
  )
}
