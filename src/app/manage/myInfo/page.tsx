import UserInfoForm from '@/components/forms/UserInfoForm'
import { getUserInfo } from '@/serverActions/handler'

export default async function MyInfo() {
  const userInfo = await getUserInfo()
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">개인정보 수정</p>
      <div className="mt-20 w-full">{userInfo && <UserInfoForm userInfo={userInfo} />}</div>
    </div>
  )
}
