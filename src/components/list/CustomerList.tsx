'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment'
import { faqResponse } from '@/types/faq'
import { inquiryResponse } from '@/types/inquiry'

type Row = {
  answerAt: string
  inquiryCategory: string
  inquiryTitle: string
  userId: string
  createdAt: string
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'answerAt', label: '답변상태', width: '' },
  { key: 'inquiryCategory', label: '유형', width: '' },
  { key: 'inquiryTitle', label: '제목', width: 'w-full' },
  { key: 'userId', label: '작성자', width: '' },
  { key: 'createdAt', label: '등록일', width: '' },
]
interface props {
  faqInfo: { rows: faqResponse[]; total: number }
  inquiryInfo: { rows: inquiryResponse[]; total: number }
}
export default function CustomerList({ faqInfo, inquiryInfo }: props) {
  const { rows: faqRows } = faqInfo
  const { rows: inquiryRows } = inquiryInfo
  const [faqData] = useState(faqRows)
  const [inquiryData, setInquiryData] = useState(inquiryRows)
  const [currentPage, setCurrentPage] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  const formatCellValue = (key: keyof Row, value: string | boolean) => {
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
      <div className="flex flex-col max-w-2xl mx-auto mt-12">
        {/* 자주묻는 질문 */}
        <p className="font-semibold border-b border-borderPrimary">BEST 자주묻는 질문</p>
        <div className="mt-4 divide-y">
          {faqData.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-4 py-3 even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex gap-2">
                  <span className="font-semibold">Q</span>
                  <span className="text-sm">{item.faqQuestion}</span>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 py-3 bg-gray-100 text-sm">{item.faqAnswer}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 자주묻는 질문 */}
        <p className="mt-4 font-semibold border-b border-borderPrimary">묻고 답하기</p>
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
            {inquiryData.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer even:bg-gray-50 hover:bg-gray-100`}
                onClick={() => {
                  // setNotice(row)
                  // console.info('🚀 row:', row)
                  // setOpenNoticeModal(true)
                }}
              >
                {columns.map(({ key, width }) => (
                  <td key={key} className={`border px-4 py-2 truncate ${width}`}>
                    {formatCellValue(key, row[key]!)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
