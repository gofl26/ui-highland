import { auth } from '@/auth'
import Header from '@/components/layouts/Header'
import { getUserInfo } from '@/serverActions/handler'
import { getMenu } from '@/serverActions/menu'
import { getSite } from '@/serverActions/site'
import type { menuResponse } from '@/types/menu'
import type { siteResponse } from '@/types/sites'
import type { userVerify } from '@/types/users'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const token = await auth()
  const API_URL = process.env.API_URL || ''

  let menu: menuResponse[] | undefined = []
  let site: siteResponse[] | undefined = undefined
  let user: userVerify | undefined = undefined
  menu = await getMenu()
  site = await getSite()
  user = await getUserInfo()
  return (
    <div className="flex min-w-[1340px] flex-col">
      <Header token={token} apiUrl={API_URL} siteInfo={site} menuInfo={menu} user={user} />
      <main>{children}</main>
    </div>
  )
}
