'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment'
import { reviewResponse } from '@/types/review'

type Row = {
  reviewStar: string
  productId: string
  userId: string
  createdAt: string
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'reviewStar', label: '별점', width: '' },
  { key: 'productId', label: '상품 명', width: 'w-full' },
  { key: 'userId', label: '작성자', width: '' },
  { key: 'createdAt', label: '등록일', width: '' },
]
interface props {
  reviewInfo: { rows: reviewResponse[]; total: number }
}
export default function ReviewList({ reviewInfo }: props) {
  const { rows } = reviewInfo
  const [reviewData, setReviewData] = useState(rows)
  const [currentPage, setCurrentPage] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  const formatCellValue = (key: keyof Row, value: string | boolean) => {
    if (key === 'userId' && typeof value === 'string') {
      const chars = [...value]
      const half = Math.floor(chars.length / 2)
      const masked = '*'.repeat(half)
      return chars.slice(half).join('') + masked
    }
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    return value
  }
  useEffect(() => {
    setCurrentPage(pathname)
  }, [pathname])
  return (
    <div className="flex flex-col items-center w-full px-20">
      <p className="flex justify-center mt-12 text-3xl font-semibold">커뮤니티</p>
      <div className="flex justify-center gap-6 mt-12">
        <button
          className={`flex justify-center items-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/notice' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/notice')}
        >
          공지사항
        </button>
        <button
          className={`flex justify-center items-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/customer' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/customer')}
        >
          고객센터
        </button>
        <button
          className={`flex justify-center items-center w-28 rounded-full px-3 py-2 ${currentPage === '/community/review' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/review')}
        >
          상품후기
        </button>
      </div>
      <div className="flex flex-col w-full max-w-4xl mt-12">
        <p className="mt-4 font-semibold border-b border-borderPrimary">상품 후기</p>
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              {columns.map(({ key, label, width }) => (
                <th key={key} className={`border px-4 py-2 truncate ${width}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviewData.map((row: any, idx: number) => (
              <>
                <tr
                  key={idx}
                  className="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
                  onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                >
                  {columns.map(({ key, width }: any) => (
                    <td key={key} className={`border px-4 py-2 truncate ${width}`}>
                      {formatCellValue(key, row[key]!)}
                    </td>
                  ))}
                </tr>

                {/* 아코디언 펼침 영역 */}
                <tr className="transition-all">
                  <td
                    colSpan={columns.length}
                    className={`p-0 border-t-0 overflow-hidden transition-all duration-300 ${
                      openIndex === idx ? 'max-h-96 py-4 px-4' : 'max-h-0 py-0 px-0'
                    }`}
                  >
                    <div className={`transition-all duration-300 ease-in-out`}>
                      {openIndex === idx && (
                        <div className="bg-gray-100 rounded p-4 text-sm">
                          <strong>상세 내용:</strong>
                          <div className="mt-2 text-gray-700">
                            {/* 커스텀 상세 내용 */}
                            {JSON.stringify(row, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
