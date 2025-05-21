import { getOrder } from '@/serverActions/orders'
import OrderList from '@/components/list/OrderList'

export default async function OrderListPage() {
  const orderList = await getOrder()

  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">주문 / 배송 관리</p>
      <OrderList className="w-full mt-20" />
    </div>
  )
}
