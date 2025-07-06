import ManageOrderListGrid from '@/components/grid/ManageOrderListGrid'
import { getOrder } from '@/serverActions/orders'

export default async function OrderPage() {
  const orderList = await getOrder()
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">주문 내역 관리</p>
      <ManageOrderListGrid orderListSrc={orderList} />
    </div>
  )
}
