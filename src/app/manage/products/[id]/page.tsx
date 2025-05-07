import ProductName from '@/components/commons/etc/ProductName'
import { getCategory } from '@/serverActions/categories'
import ProductListGrid from '@/components/grid/ProductListGrid'

export default async function Products() {
  const category = await getCategory()
  if (!category) return null
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <div className="flex gap-2">
        <p className="text-lg font-semibold">상품 관리</p>
        <p className="text-lg font-semibold">-</p>
        <ProductName category={category} />
      </div>
      <ProductListGrid category={category} />
    </div>
  )
}
