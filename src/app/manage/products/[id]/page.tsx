import ProductName from '@/components/commons/etc/ProductName'
import ProductListGrid from '@/components/grid/ProductListGrid'
import { getCategory } from '@/serverActions/categories'

export default async function Products() {
  const category = await getCategory()
  if (!category) return null
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <div className="flex gap-2">
        <p className="text-lg font-semibold">상품 관리</p>
        <p className="text-lg font-semibold">-</p>
        <ProductName category={category} />
      </div>
      <ProductListGrid category={category} />
    </div>
  )
}
