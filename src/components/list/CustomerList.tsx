'use client'
import { useEffect, useState, Fragment } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment'
import type { Session } from 'next-auth'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { createInquiry, getInquiry } from '@/serverActions/inquiries'
import CreateInquiryModal from '@/components/modals/CreateInquiryModal'
import InquiryForm from '@/components/forms/InquiryForm'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { atomUserInfo, atomInquiryInfo } from '@/stores/atoms'
import type { faqResponse } from '@/types/faq'
import type { inquiryResponse, inquiryForm } from '@/types/inquiry'
import { productResponse } from '@/types/product'
import { Lock } from 'lucide-react'

type Row = {
  answerAt: string
  inquiryCategory: string
  inquiryTitle: string
  userName: string
  createdAt: string
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'answerAt', label: '답변상태', width: '' },
  { key: 'inquiryCategory', label: '유형', width: '' },
  { key: 'inquiryTitle', label: '제목/상품', width: 'w-full' },
  { key: 'userName', label: '작성자', width: '' },
  { key: 'createdAt', label: '등록일', width: '' },
]

interface props {
  faqInfo: { rows: faqResponse[]; total: number }
  inquiryInfo: { rows: inquiryResponse[]; total: number }
  productInfo: { rows: productResponse[]; total: number }
  token: null | Session
}
export default function CustomerList({ faqInfo, inquiryInfo, productInfo, token }: props) {
  const { rows: faqRows } = faqInfo
  const { rows: inquiryRows } = inquiryInfo
  const { rows: productRows } = productInfo
  const [faqData] = useState(faqRows)
  const [inquiryData, setInquiryData] = useState(inquiryRows)
  const [currentPage, setCurrentPage] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [openInquiryIndex, setOpenInquiryIndex] = useState<number | null>(null)
  const [openCreateInquiryModal, setOpenCreateInquiryModal] = useState(false)

  const inquiryForm = useAtomValue<inquiryForm>(atomInquiryInfo)
  const userInfo = useAtomValue(atomUserInfo)
  const resetForm = useResetAtom(atomInquiryInfo)
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()

  const handleClickSaveInquiry = async () => {
    if (!inquiryForm.inquiryTitle || !inquiryForm.productId)
      return showToast('상품과 문의를 작성해주세요.', 'error')
    const result = await createInquiry(inquiryForm)
    if (!result) return showToast('문의 등록에 실패했습니다.', 'error')
    else showToast('등록되었습니다.', 'success')
    const inquiryResult = await getInquiry()
    if (!inquiryResult) return showToast('문의 조회에 실패했습니다.', 'error')
    const { rows, total } = inquiryResult
    setInquiryData(rows)
    resetForm()
    setOpenCreateInquiryModal(false)
  }
  const formatCellValue = (key: keyof Row, value: string | boolean, isPublic = true) => {
    if (key === 'userName' && typeof value === 'string') {
      const chars = Array.from(value)
      if (chars.length === 1) return value
      if (chars.length === 2) return `${chars[0]}*`
      return `${chars[0]}${'*'.repeat(chars.length - 2)}${chars[chars.length - 1]}`
    }
    if (key === 'answerAt') return value ? '답변완료' : '미답변'
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    if (key === 'inquiryTitle' && !isPublic) return '비밀글 입니다.'
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
        {/* 묻고 답하기 */}
        <div
          className={`flex w-full items-center mt-4 py-1 border-b border-borderPrimary ${token ? 'justify-between' : ''}`}
        >
          <p className="font-semibold">묻고 답하기</p>
          {token && (
            <button
              className="px-3 py-2 bg-bgPrimary text-textPrimary rounded-lg"
              onClick={() => setOpenCreateInquiryModal(true)}
            >
              작성하기
            </button>
          )}
        </div>
        {openCreateInquiryModal && (
          <CreateInquiryModal
            isOpen={openCreateInquiryModal}
            onClose={() => setOpenCreateInquiryModal(false)}
            onSave={handleClickSaveInquiry}
          >
            <p className="text-xl font-semibold">문의 글 작성</p>
            <InquiryForm className="w-full mt-4" products={productRows} />
          </CreateInquiryModal>
        )}
        <table className="min-w-full mt-4 border-collapse border border-borderDefault text-sm">
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
            {inquiryData.map((row: any, idx: number) => (
              <Fragment key={idx}>
                <tr
                  className="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    if (userInfo.role !== 'admin' && !row.isPublic && row.userId !== userInfo.id)
                      return
                    setOpenInquiryIndex((prev) => (prev === idx ? null : idx))
                  }}
                >
                  {columns.map(({ key, width }: any) => (
                    <td key={key} className={`border  px-4 py-2 truncate ${width}`}>
                      <div className="flex items-center gap-1">
                        {key === 'inquiryTitle' && !row.isPublic && <Lock size="14" />}
                        {formatCellValue(key, row[key]!, row.isPublic)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 아코디언 펼침 영역 */}
                <tr className="transition-all">
                  <td
                    colSpan={columns.length}
                    className={`border-t-0 overflow-hidden transition-all duration-300 ${
                      openInquiryIndex === idx ? 'max-h-96 py-1 px-3' : 'max-h-0 py-0 px-0'
                    }`}
                  >
                    <div className={`transition-all duration-300 ease-in-out`}>
                      {openInquiryIndex === idx && (
                        <div className="rounded text-sm">
                          <div className="mt-2">
                            {/* 커스텀 상세 내용 */}
                            {row?.inquiryTitle}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
