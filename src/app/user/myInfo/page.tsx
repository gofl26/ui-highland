import DeliveryForm from '@/components/forms/DeliveryFrom'
import UserInfoForm from '@/components/forms/UserInfoForm'
import { getDelivery } from '@/serverActions/deliveryAddress'
import { getUserInfo } from '@/serverActions/handler'

export default async function MyInfo() {
  const userInfo = await getUserInfo()
  const deliveryInfo = await getDelivery()
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">개인정보 수정</p>
      <div className="mt-20 w-full">{deliveryInfo && <DeliveryForm delivery={deliveryInfo} />}</div>
      <div className="mt-4 w-full">{userInfo && <UserInfoForm userInfo={userInfo} />}</div>
    </div>
  )
}
