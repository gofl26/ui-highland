import Image from 'next/image'
import { getUserInfo } from '@/serverActions/handler'
import { getCategory } from '@/serverActions/categories'
import { manageSideBarMenu } from '@/stores/sideBarMenu'
import SideBarMenuButton from '@/components/commons/button/sideBarMenuButton'
import type { categoryResponse } from '@/types/category'

export default async function ManageSideBar() {
  const userInfo = await getUserInfo()
  if (!userInfo) return null

  let categories: categoryResponse[] = []
  try {
    const rows = await getCategory()
    if (!rows) {
    } else categories = rows
  } catch (error) {
    console.error('🔥 fetch error:', error)
  }
  return (
    <div className="flex flex-col w-64 shrink-0 gap-8 p-4 bg-bgSideBar text-textDefault overflow-y-auto custom-scroll">
      <div className="flex w-full py-4 gap-4 justify-center border-b border-borderSideBarDefault">
        <Image
          src="/assets/images/common/logo.svg"
          alt="logo"
          width="0"
          height="0"
          priority
          style={{ width: '32px', height: 'auto' }}
        />
        <div className="flex flex-col">
          <p className="font-medium">{userInfo.user_name}</p>
          <p className="text-xs font-normal">{userInfo.email}</p>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {manageSideBarMenu.map(({ path, name }, index) => (
          <SideBarMenuButton
            key={index}
            path={path}
            name={name}
            categories={categories}
            type="manage"
          />
        ))}
      </div>
    </div>
  )
}
