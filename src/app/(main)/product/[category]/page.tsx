import Image from 'next/image'

import { auth } from '@/auth'
import ProductName from '@/components/commons/etc/ProductName'
import ProductList from '@/components/list/ProductList'
import { getCategory } from '@/serverActions/categories'
import { getProduct } from '@/serverActions/products'

export default async function Product() {
  const API_URL = process.env.API_URL || ''
  const category = await getCategory()
  const product = await getProduct()
  const token = await auth()
  if (!category || !product) return null
  return (
    <div className="flex w-full flex-col items-center overflow-auto text-textDefault">
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-4 bg-[url('/assets/images/common/background01.svg')] bg-cover bg-no-repeat">
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
      <ProductList
        product={product}
        category={category}
        apiUrl={API_URL}
        token={token ? true : false}
      />
    </div>
  )
}
