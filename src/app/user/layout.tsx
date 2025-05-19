import Header from '@/components/layouts/Header'
import UserSideBar from '@/components/layouts/UserSideBar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* 고정 사이드바 */}
        <UserSideBar />
        {/* 스크롤 되는 콘텐츠 */}
        <main className="flex-1 overflow-y-auto custom-scroll">{children}</main>
      </div>
    </div>
  )
}
