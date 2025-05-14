'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { faqResponse } from '@/types/faq'

interface props {
  faqInfo: { rows: faqResponse[]; total: number }
}
export default function CustomerList({ faqInfo }: props) {
  const { rows, total } = faqInfo
  const [data] = useState(rows)
  const [currentPage, setCurrentPage] = useState('')

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setCurrentPage(pathname)
  }, [pathname])
  return (
    <div className="flex flex-col items-center w-full px-20">
      <p className="flex justify-center mt-12 text-3xl font-semibold">커뮤니티</p>
      <div className="flex justify-center gap-6 mt-12">
        <button
          className={`flex justify-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/notice' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/notice')}
        >
          공지사항
        </button>
        <button
          className={`flex justify-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/customer' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/customer')}
        >
          고객센터
        </button>
        <button
          className={`flex justify-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/review' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/review')}
        >
          상품후기
        </button>
      </div>
      <div className="w-full mt-12"></div>
    </div>
  )
}
