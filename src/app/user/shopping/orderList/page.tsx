import OrderList from '@/components/list/OrderList'
import { getOrder } from '@/serverActions/orders'

export default async function OrderListPage() {
  const orderList = await getOrder()
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">주문 / 배송 관리</p>
      <OrderList className="mt-20 w-full" orderListSrc={orderList} />
    </div>
  )
}
