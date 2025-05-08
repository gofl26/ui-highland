import Image from 'next/image'
import ProductName from '@/components/commons/etc/ProductName'
import ProductList from '@/components/list/ProductList'
import { getCategory } from '@/serverActions/categories'
import { getProduct } from '@/serverActions/products'

export default async function Product() {
  const category = await getCategory()
  const product = await getProduct()
  if (!category || !product) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <div className="flex flex-col justify-center items-center w-full gap-4 min-h-[300px] bg-[url('/assets/images/common/background01.svg')] bg-no-repeat bg-cover">
        <div className="flex items-center gap-6">
          <Image
            src="/assets/images/product/apple_handprint.png"
            alt="apple_handprint"
            width="90"
            height="63"
          />
          <ProductName category={category} textSize="text-4xl" />
        </div>
        <p className="text-sm">껍질에도 영양성분이 가득한 애플 하이랜드 사과</p>
      </div>
      <ProductList product={product} category={category} />
    </div>
  )
}
