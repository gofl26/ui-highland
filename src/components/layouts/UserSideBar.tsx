import Image from 'next/image'
import { getUserInfo } from '@/serverActions/handler'
import { userSideBarMenu } from '@/stores/sideBarMenu'
import SideBarMenuButton from '@/components/commons/button/sideBarMenuButton'
import ErrorToast from '@/components/commons/toast/ErrorToast'

export default async function UserSideBar() {
  const userInfo = await getUserInfo()
  if (!userInfo) return null
  let errorMessage: string[] = []
  return (
    <div className="flex flex-col w-64 shrink-0 gap-8 p-4 bg-bgSideBar text-textDefault overflow-y-auto custom-scroll">
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
        {userSideBarMenu.map(({ path, name }, index) => (
          <SideBarMenuButton key={index} path={path} name={name} type="user" />
        ))}
      </div>
    </div>
  )
}
