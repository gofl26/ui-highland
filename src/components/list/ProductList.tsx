'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { CircleArrowUp, Plus, Minus } from 'lucide-react'
import { createCart } from '@/serverActions/cart'
import BuyProductModal from '@/components/modals/BuyProductModal'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { formatNumberWithCommas } from '@/utils/formatNumberWithCommas'
import { categoryResponse } from '@/types/category'
import { productResponse } from '@/types/product'
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
            className="bg-bgSecondary rounded-lg border overflow-hidden cursor-pointer h-[410px]"
            onClick={() => handleClickProductItem(product.id)}
          >
            {/* 이미지 */}
            <div className="relative w-full h-[320px] group">
              <Image
                src={product.productsFile}
                alt={product.productName}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 퀵뷰 텍스트 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white px-4 py-2 border border-white rounded text-sm font-semibold shadow-md">
                  퀵뷰
                </span>
              </div>
            </div>
            <div className="flex flex-col px-4 py-2 gap-2">
              <p className="text-xl">{product.productName}</p>
              <p className="text-[#FF5A5A]">{formatNumberWithCommas(product.productPrice)} 원</p>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <BuyProductModal isOpen={openBuyProductModal} onClose={() => setOpenBuyProductModal(false)}>
          <div className="flex w-full gap-4">
            <div className="relative w-1/2 min-h-[300px]">
              <Image
                src={selectedProduct.productsFile}
                alt={selectedProduct.productName}
                className="object-cover rounded-lg"
                fill
                priority
                sizes="25vw"
              />
            </div>
            <div className="flex flex-col w-1/2 px-8 py-2 gap-6">
              <div className="p-2 border-b">
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
                    className="flex w-10 border justify-center items-center"
                    onClick={handleClickMinusBtn}
                  >
                    <Minus size="16" />
                  </button>
                  <div className="flex w-16 py-2 border-t border-b items-center justify-center">
                    {quantity}
                  </div>
                  <button
                    className="flex w-10 border justify-center items-center"
                    onClick={handleClickPlusBtn}
                  >
                    <Plus size="16" />
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-center gap-4">
                <button
                  className="w-1/2 py-2 border rounded-lg border-borderDefault"
                  onClick={handleClickCreateCart}
                >
                  장바구니
                </button>
                <button
                  className="w-1/2 py-2 rounded-lg bg-bgPrimary text-textPrimary"
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
