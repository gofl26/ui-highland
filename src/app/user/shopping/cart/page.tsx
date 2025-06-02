import CartList from '@/components/list/CartList'
import { getCart } from '@/serverActions/cart'
export default async function OrderListPage() {
  const cartList = await getCart()

  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">장바구니</p>
      {cartList && <CartList className="mt-20 w-full" cartInfo={cartList} />}
    </div>
  )
}
