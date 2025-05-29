'use client'
import { useState } from 'react'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { getInquiry } from '@/serverActions/inquiries'
import type { inquiryResponse, inquiryForm } from '@/types/inquiry'
import moment from 'moment'

type Row = {
  userName: string
  productName: string
  inquiryCategory: string
  inquiryTitle: string
  createdAt: string
}
const initInquiryForm: inquiryForm = {
  productId: '',
  inquiryCategory: '',
  inquiryTitle: '',
  inquiryDesc: '',
  isPublic: true,
  inquiryAnswer: '',
  answerAt: '',
}
interface props {
  inquiryInfo: { rows: inquiryResponse[]; total: number }
}
export default function InquiryListGrid({ inquiryInfo }: props) {
  const { rows, total } = inquiryInfo
  const pageSize = 10
  const columns: { key: keyof Row; label: string }[] = [
    { key: 'userName', label: '작성자' },
    { key: 'productName', label: '상품' },
    { key: 'inquiryCategory', label: '문의 카테고리' },
    { key: 'inquiryTitle', label: '문의 제목' },
    { key: 'createdAt', label: '문의 작성일' },
  ]
  const { showToast } = useToast()

  const [totalNumber, setTotalNumber] = useState(total)
  const [page, setPage] = useState(1)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [data, setData] = useState(rows)
  const [inquiryForm, setInquiryForm] = useState<inquiryForm>(initInquiryForm)
  const [openAnswerModal, setOpenAnswerModal] = useState(false)

  const handleClickDeleteInquiry = async () => {}
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getInquiry(`from=${(page - 2) * 10}&size=10&sort=createdAt:desc`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  const handleClickNextBtn = async () => {
    setPage((p) => Math.min(Math.ceil(totalNumber / pageSize), p + 1))
    try {
      const result = await getInquiry(`from=${page * 10}&size=10&sort=createdAt:desc`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  const formatCellValue = (key: keyof Row, value: string | boolean) => {
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    return value
  }
  return (
    <div className="flex w-full mt-4">
      <div className="w-full">
        <div className="flex w-full h-10 justify-between items-center mb-4">
          <p className="text-sm">총 {totalNumber} 개</p>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null && (
              <div className="flex gap-2">
                <button
                  className="bg-red-600 text-textPrimary px-3 py-2 rounded-lg"
                  onClick={handleClickDeleteInquiry}
                >
                  삭제
                </button>
                <button
                  className="bg-bgHeader px-3 py-2 rounded-lg"
                  onClick={() => {
                    setInquiryForm(data[selectedRowIndex])
                    setOpenAnswerModal(true)
                  }}
                >
                  답변
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Table */}
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              {columns.map(({ key, label }) => (
                <th key={key} className="border px-4 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer ${
                  selectedRowIndex === idx
                    ? 'bg-bgPrimary text-textPrimary'
                    : 'even:bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (selectedRowIndex === idx) {
                    setSelectedRowIndex(null)
                  } else {
                    setSelectedRowIndex(idx)
                  }
                }}
              >
                {columns.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {formatCellValue(key, row[key]!)}
                  </td>
                ))}
              </tr>
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
    </div>
  )
}
