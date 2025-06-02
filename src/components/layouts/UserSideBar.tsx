import Image from 'next/image'

import SideBarMenuButton from '@/components/commons/button/sideBarMenuButton'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import { getUserInfo } from '@/serverActions/handler'
import { userSideBarMenu } from '@/stores/sideBarMenu'

export default async function UserSideBar() {
  const userInfo = await getUserInfo()
  if (!userInfo) return null
  let errorMessage: string[] = []
  return (
    <div className="custom-scroll flex w-64 shrink-0 flex-col gap-8 overflow-y-auto bg-bgSideBar p-4 text-textDefault">
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
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
        {userSideBarMenu.map(({ path, name }, index) => (
          <SideBarMenuButton key={index} path={path} name={name} type="user" />
        ))}
      </div>
    </div>
  )
}
