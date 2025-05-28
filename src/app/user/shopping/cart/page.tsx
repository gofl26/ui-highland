import { getCart } from '@/serverActions/cart'
import CartList from '@/components/list/CartList'
export default async function OrderListPage() {
  const cartList = await getCart()

  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">장바구니</p>
      {cartList && <CartList className="w-full mt-20" cartInfo={cartList} />}
    </div>
  )
}
