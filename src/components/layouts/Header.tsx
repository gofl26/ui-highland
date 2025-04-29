import AuthHeader from '@/components/layouts/AuthHeader'
import MenuButton from '@/components/commons/button/menuButton'
import ManageButton from '@/components/commons/button/manageButton'

export default async function HeaderLayout() {
  return (
    <header className="flex flex-col w-full bg-bgHeader backdrop-blur-sm">
      <AuthHeader />
      <div className="flex w-full justify-between px-16 py-4">
        <div className="flex w-1/2 h-14 items-center gap-4">
          <MenuButton />
        </div>
        <div className="flex w-1/2 justify-end gap-4">
          <ManageButton />
        </div>
      </div>
    </header>
  )
}
