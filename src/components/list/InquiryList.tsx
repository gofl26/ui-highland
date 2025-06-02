'use client'
import moment from 'moment'
import { useState, Fragment } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { getInquiry } from '@/serverActions/inquiries'
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
    <div className="mt-20 flex w-full flex-col">
      <table className="min-w-full border-collapse border border-borderDefault text-sm">
        <thead>
          <tr className="bg-bgHeader">
            {columns.map(({ key, label, width }) => (
              <th key={key} className={`truncate border px-4 py-2 ${width}`}>
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
                onClick={() => setOpenInquiryIndex((prev) => (prev === idx ? null : idx))}
              >
                {columns.map(({ key, width }: any) => (
                  <td key={key} className={`truncate border px-4 py-2 ${width}`}>
                    {formatCellValue(key, row[key]!)}
                  </td>
                ))}
              </tr>

              {/* 아코디언 펼침 영역 */}
              <tr className="transition-all">
                <td
                  colSpan={columns.length}
                  className={`overflow-hidden border-t-0 p-0 transition-all duration-300 ${
                    openInquiryIndex === idx ? 'max-h-96 p-4' : 'max-h-0 p-0'
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
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={handleClickPreBtn}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {page} / {Math.max(1, Math.ceil(totalNumber / pageSize))}
        </span>
        <button
          onClick={handleClickNextBtn}
          disabled={page >= Math.ceil(totalNumber / pageSize)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  )
}
