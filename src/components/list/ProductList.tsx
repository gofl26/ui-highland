'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CircleArrowUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { productResponse } from '@/types/product'
import { formatNumberWithCommas } from '@/utils/formatNumberWithCommas'
import { categoryResponse } from '@/types/category'
import BuyProductModal from '../modals/BuyProductModal'
interface props {
  product: { rows: productResponse[]; total: number }
  category: categoryResponse[]
}

export default function ProductList({ product, category }: props) {
  const { rows, total } = product
  const [showTopMoveBtn, setShowTopMoveBtn] = useState(false)
  const [productList, setProductList] = useState<productResponse[]>([])
  const [openBuyProductModal, setOpenBuyProductModal] = useState(false)

  const showTopMoveBtnRef = useRef(showTopMoveBtn)
  const pathname = usePathname()
  useEffect(() => {
    const findCategory = category.find(({ categoryUrl }) => pathname.includes(categoryUrl))
    const a = rows.filter(({ categoryId }) => {
      return categoryId === findCategory?.id
    })
    setProductList(a)
  }, [pathname, category, rows])
  useEffect(() => {
    showTopMoveBtnRef.current = showTopMoveBtn
  }, [showTopMoveBtn])
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const prev = showTopMoveBtnRef.current
      if (scrollY > 450 && !prev) {
        setShowTopMoveBtn(true)
      } else if (scrollY <= 450 && prev) {
        setShowTopMoveBtn(false)
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="flex-col w-full items-center">
      {showTopMoveBtn === true && (
        <button
          className="fixed top-12 right-12"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <CircleArrowUp size="30" />
        </button>
      )}
      <div className="flex justify-center gap-6 mt-12">
        <button className="flex justify-center bg-bgPrimary text-textPrimary w-28 rounded-full px-3 py-2">
          전체
        </button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">가정용</button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">선물용</button>
      </div>
      <div className="p-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => (
          <div
            key={product.id}
            className="bg-bgSecondary rounded-lg border overflow-hidden cursor-pointer 2xl:h-[450px]"
            // onClick={() => handleClickModelItem(product.id)}
          >
            {/* 이미지 */}
            <div className="relative w-full h-48 2xl:h-[400px]">
              {/* <Image
                src={model.screenshotPath}
                alt={model.modelName}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
              /> */}
            </div>
            <div className="flex flex-col px-4 py-2 gap-2">
              <p className="text-xl">{product.productName}</p>
              <p className="text-[#FF5A5A]">{formatNumberWithCommas(product.productPrice)} 원</p>
            </div>
          </div>
        ))}
      </div>
      <BuyProductModal isOpen={openBuyProductModal} onClose={() => setOpenBuyProductModal(false)}>
        <div></div>
      </BuyProductModal>
    </div>
  )
}
