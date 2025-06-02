import type { Session } from 'next-auth'

import ManageButton from '@/components/commons/button/manageButton'
import MenuButton from '@/components/commons/button/menuButton'
import AuthHeader from '@/components/layouts/AuthHeader'
import type { menuResponse } from '@/types/menu'
import type { siteResponse } from '@/types/sites'
import type { userVerify } from '@/types/users'

interface props {
  token: Session | null
  apiUrl: string
  siteInfo: siteResponse[] | undefined
  menuInfo: menuResponse[] | undefined
  user: userVerify | undefined
}
export default async function HeaderLayout({ token, apiUrl, siteInfo, menuInfo, user }: props) {
  return (
    <header className="flex w-full flex-col bg-bgHeader backdrop-blur-sm">
      <AuthHeader token={token} />
      <div className="flex w-full justify-between px-16 py-4">
        <div className="flex h-14 w-1/2 items-center gap-4">
          {siteInfo && siteInfo.length > 0 && apiUrl && (
            <MenuButton apiUrl={apiUrl} siteInfo={siteInfo[0]} menuInfo={menuInfo} />
          )}
        </div>
        <div className="flex w-1/2 justify-end gap-4">
          <ManageButton userInfo={user} />
        </div>
      </div>
    </header>
  )
}
