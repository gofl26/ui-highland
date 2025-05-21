'use client'
import { useState } from 'react'
import moment from 'moment'
import { getInquiry } from '@/serverActions/inquiries'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { inquiryResponse } from '@/types/inquiry'

type Row = {
  answerAt: string
  inquiryCategory: string
  inquiryTitle: string
  createdAt: string
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'answerAt', label: '답변상태', width: '' },
  { key: 'inquiryCategory', label: '유형', width: '' },
  { key: 'inquiryTitle', label: '제목/상품', width: 'w-full' },
  { key: 'createdAt', label: '등록일', width: '' },
]
interface props {
  inquiryInfo: { rows: inquiryResponse[]; total: number }
}

export default function InquiryList({ inquiryInfo }: props) {
  const { rows: inquiryRows } = inquiryInfo
  const pageSize = 10
  const { showToast } = useToast()

  const [inquiryData, setInquiryData] = useState(inquiryRows)
  const [page, setPage] = useState(1)
  const [totalNumber, setTotalNumber] = useState(0)
  const [openInquiryIndex, setOpenInquiryIndex] = useState<number | null>(null)

  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getInquiry(`from=${(page - 2) * 10}&size=10`)
      if (result) {
        const { rows, total } = result
        setInquiryData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  const handleClickNextBtn = async () => {
    setPage((p) => Math.min(Math.ceil(totalNumber / pageSize), p + 1))
    try {
      const result = await getInquiry(`from=${page * 10}&size=10`)
      if (result) {
        const { rows, total } = result
        setInquiryData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  const formatCellValue = (key: keyof Row, value: string | boolean) => {
    if (key === 'answerAt') return value ? '답변완료' : '미답변'
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    return value
  }
  return (
    <div className="flex flex-col w-full mt-20">
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
          {inquiryData.map((row: any, idx: number) => (
            <>
              <tr
                key={idx}
                className="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
                onClick={() => setOpenInquiryIndex((prev) => (prev === idx ? null : idx))}
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
                    openInquiryIndex === idx ? 'max-h-96 py-4 px-4' : 'max-h-0 py-0 px-0'
                  }`}
                >
                  <div className={`transition-all duration-300 ease-in-out`}>
                    {openInquiryIndex === idx && (
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
      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          onClick={handleClickPreBtn}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {page} / {Math.max(1, Math.ceil(totalNumber / pageSize))}
        </span>
        <button
          onClick={handleClickNextBtn}
          disabled={page >= Math.ceil(totalNumber / pageSize)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  )
}
