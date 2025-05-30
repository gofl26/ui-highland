import Image from 'next/image'

import SideBarMenuButton from '@/components/commons/button/sideBarMenuButton'
import { getCategory } from '@/serverActions/categories'
import { getUserInfo } from '@/serverActions/handler'
import { manageSideBarMenu } from '@/stores/sideBarMenu'
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
    <div className="custom-scroll flex w-64 shrink-0 flex-col gap-8 overflow-y-auto bg-bgSideBar p-4 text-textDefault">
      <div className="flex w-full justify-center gap-4 border-b border-borderSideBarDefault py-4">
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
      <div className="flex w-full flex-col">
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
