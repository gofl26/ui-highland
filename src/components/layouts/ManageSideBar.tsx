import Image from 'next/image'
import { getUserInfo } from '@/serverActions/handler'
import { getCategory } from '@/serverActions/categories'
import { sideBarMenu } from '@/stores/sideBarMenu'
import SideBarMenuButton from '@/components/commons/button/sideBarMenuButton'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import type { categoryResponse } from '@/types/category'

export default async function ManageSideBar() {
  const userInfo = await getUserInfo()
  if (!userInfo) return null

  let errorMessage = []
  let categories: categoryResponse[] = []
  try {
    const rows = await getCategory()
    if (!rows) {
      errorMessage.push('카테고리 정보를 불러오지 못했습니다.')
    } else categories = rows
  } catch (error) {
    errorMessage.push('카테고리 정보를 불러오지 못했습니다.')
    console.error('🔥 fetch error:', error)
  }
  return (
    <div className="flex flex-col w-64 shrink-0 gap-8 p-4 bg-bgSideBar overflow-y-auto text-textDefault">
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
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
        {sideBarMenu.map(({ path, name }, index) => (
          <SideBarMenuButton key={index} path={path} name={name} categories={categories} />
        ))}
      </div>
    </div>
  )
}
