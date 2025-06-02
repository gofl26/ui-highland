'use client'
import { CircleArrowUp, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import BuyProductModal from '@/components/modals/BuyProductModal'
import { createCart } from '@/serverActions/cart'
import { categoryResponse } from '@/types/category'
import { productResponse } from '@/types/product'
import { formatNumberWithCommas } from '@/utils/formatNumberWithCommas'
interface props {
  product: { rows: productResponse[]; total: number }
  category: categoryResponse[]
  apiUrl: string
  token: boolean
}

export default function ProductList({ product, category, apiUrl, token }: props) {
  const { rows, total } = product
  const [showTopMoveBtn, setShowTopMoveBtn] = useState(false)
  const [productList, setProductList] = useState<productResponse[]>([])
  const [openBuyProductModal, setOpenBuyProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<productResponse>()
  const [quantity, setQuantity] = useState(1)

  const showTopMoveBtnRef = useRef(showTopMoveBtn)
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()

  const handleClickProductItem = async (productId: string) => {
    const product = productList.find(({ id }) => id === productId)
    if (!product) return
    setSelectedProduct(product)
    setQuantity(1)
    setOpenBuyProductModal(true)
  }
  const handleClickCreateCart = async () => {
    if (!selectedProduct) return
    if (!token) {
      router.push('/login')
      return
    }
    const cartData = {
      productId: selectedProduct.id,
      cartQuantity: quantity,
    }
    const result = await createCart(cartData)
    if (result) showToast('장바구니에 담았습니다.', 'success')
    else showToast('장바구니 담기에 실패했습니다..', 'error')
  }
  const handleClickBuyProduct = async () => {
    if (!selectedProduct) return
    if (!token) {
      router.push('/login')
      return
    }
    const cartData = {
      productId: selectedProduct.id,
      cartQuantity: quantity,
    }
    const result = await createCart(cartData)
    if (result) {
      showToast('장바구니에 담았습니다.', 'success')
      router.push('/users/cart')
    } else showToast('장바구니에 담기에 실패했습니다..', 'error')
  }
  const handleClickMinusBtn = () => {
    if (quantity === 1) return
    setQuantity((p) => p - 1)
  }
  const handleClickPlusBtn = () => {
    setQuantity((p) => p + 1)
  }
  useEffect(() => {
    const findCategory = category.find(({ categoryUrl }) => pathname.includes(categoryUrl))
    const transProductList = rows.reduce<productResponse[]>(
      (acc, { categoryId, productsFile, ...etc }) => {
        if (categoryId === findCategory?.id) {
          const image = `${apiUrl}/api/files/getFile?fileName=${productsFile}`
          acc.push({ categoryId, productsFile: image, ...etc })
        }
        return acc
      },
      [],
    )
    setProductList(transProductList)
  }, [pathname, category, rows, apiUrl])
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
    <div className="w-full flex-col items-center">
      {showTopMoveBtn === true && (
        <button
          className="fixed right-12 top-12"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <CircleArrowUp size="30" />
        </button>
      )}
      <div className="mt-12 flex justify-center gap-6">
        <button className="flex w-28 justify-center rounded-full bg-bgPrimary px-3 py-2 text-textPrimary">
          전체
        </button>
        <button className="flex w-28 justify-center rounded-full border px-3 py-2">가정용</button>
        <button className="flex w-28 justify-center rounded-full border px-3 py-2">선물용</button>
      </div>
      <div className="grid grid-cols-1 gap-6 p-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productList.map((product) => (
          <div
            key={product.id}
            className="h-[410px] cursor-pointer overflow-hidden rounded-lg border bg-bgSecondary"
            onClick={() => handleClickProductItem(product.id)}
          >
            {/* 이미지 */}
            <div className="group relative h-[320px] w-full">
              <Image
                src={product.productsFile}
                alt={product.productName}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* 퀵뷰 텍스트 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded border border-white px-4 py-2 text-sm font-semibold text-white shadow-md">
                  퀵뷰
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-4 py-2">
              <p className="text-xl">{product.productName}</p>
              <p className="text-[#FF5A5A]">{formatNumberWithCommas(product.productPrice)} 원</p>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <BuyProductModal isOpen={openBuyProductModal} onClose={() => setOpenBuyProductModal(false)}>
          <div className="flex w-full gap-4">
            <div className="relative min-h-[300px] w-1/2">
              <Image
                src={selectedProduct.productsFile}
                alt={selectedProduct.productName}
                className="rounded-lg object-cover"
                fill
                priority
                sizes="25vw"
              />
            </div>
            <div className="flex w-1/2 flex-col gap-6 px-8 py-2">
              <div className="border-b p-2">
                <p className="font-semibold">{selectedProduct.productName}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-sm">판매가</p>
                <p className="text-sm">{formatNumberWithCommas(selectedProduct.productPrice)}원</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-sm">배송비</p>
                <p className="text-sm">무료</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-sm">수량</p>
                <div className="flex">
                  <button
                    className="flex w-10 items-center justify-center border"
                    onClick={handleClickMinusBtn}
                  >
                    <Minus size="16" />
                  </button>
                  <div className="flex w-16 items-center justify-center border-y py-2">
                    {quantity}
                  </div>
                  <button
                    className="flex w-10 items-center justify-center border"
                    onClick={handleClickPlusBtn}
                  >
                    <Plus size="16" />
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-center gap-4">
                <button
                  className="w-1/2 rounded-lg border border-borderDefault py-2"
                  onClick={handleClickCreateCart}
                >
                  장바구니
                </button>
                <button
                  className="w-1/2 rounded-lg bg-bgPrimary py-2 text-textPrimary"
                  onClick={handleClickBuyProduct}
                >
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </BuyProductModal>
      )}
    </div>
  )
}
