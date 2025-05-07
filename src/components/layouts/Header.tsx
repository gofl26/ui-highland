import { getSite } from '@/serverActions/site'
import { getMenu } from '@/serverActions/menu'
import AuthHeader from '@/components/layouts/AuthHeader'
import MenuButton from '@/components/commons/button/menuButton'
import ManageButton from '@/components/commons/button/manageButton'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import { getUserInfo } from '@/serverActions/handler'
import type { siteResponse } from '@/types/sites'
import type { menuResponse } from '@/types/menu'
import type { userVerify } from '@/types/users'

export default async function HeaderLayout() {
  const API_URL = process.env.API_URL

  let menu: menuResponse[] = []
  let site: siteResponse | undefined = undefined
  let user: userVerify | undefined = undefined
  let errorMessage = []
  if (!API_URL) errorMessage.push('API 연결에 실패했습니다.')
  else {
    try {
      const menuInfo = await getMenu()
      if (!menuInfo) errorMessage.push('메뉴 정보를 불러오지 못했습니다.')
      else menu = menuInfo
    } catch (error) {
      errorMessage.push('메뉴 정보를 불러오지 못했습니다.')
      console.error('🔥 fetch error:', error)
    }
    try {
      const siteInfo = await getSite()
      if (!siteInfo) errorMessage.push('사이트 정보를 불러오지 못했습니다.')
      else site = siteInfo
    } catch (error) {
      errorMessage.push('사이트 정보를 불러오지 못했습니다.')
      console.error('🔥 fetch error:', error)
    }
    try {
      user = await getUserInfo()
    } catch (error) {
      errorMessage.push('유저 정보를 불러오지 못했습니다.')
      console.error('🔥 fetch error:', error)
    }
  }
  return (
    <header className="flex flex-col w-full bg-bgHeader backdrop-blur-sm">
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
      <AuthHeader />
      <div className="flex w-full justify-between px-16 py-4">
        <div className="flex w-1/2 h-14 items-center gap-4">
          {site && API_URL && <MenuButton apiUrl={API_URL} siteInfo={site} menuInfo={menu} />}
        </div>
        <div className="flex w-1/2 justify-end gap-4">
          <ManageButton userInfo={user} />
        </div>
      </div>
    </header>
  )
}
