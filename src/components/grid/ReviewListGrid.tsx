'use client'
import { useState } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { getReview } from '@/serverActions/reviews'
import type { reviewResponse, reviewForm } from '@/types/review'

type Row = {
  productId: string
  reviewComment: string
  reviewStar: string
  createdAt: string
}
const initReviewForm: reviewForm = {
  productId: '',
  orderItemsId: '',
  reviewStar: '',
  reviewComment: '',
  reviewAnswer: '',
  reviewsFile: '',
}
interface props {
  reviewInfo: { rows: reviewResponse[]; total: number }
}
export default function ReviewListGrid({ reviewInfo }: props) {
  const { rows, total } = reviewInfo
  const pageSize = 10
  const columns: { key: keyof Row; label: string }[] = [
    { key: 'productId', label: '상품' },
    { key: 'reviewStar', label: '별점' },
    { key: 'reviewComment', label: '후기' },
    { key: 'createdAt', label: '후기 작성일' },
  ]
  const { showToast } = useToast()

  const [totalNumber, setTotalNumber] = useState(total)
  const [page, setPage] = useState(1)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [data, setData] = useState(rows)
  const [reviewForm, setReviewForm] = useState<reviewForm>(initReviewForm)
  const [openAnswerModal, setOpenAnswerModal] = useState(false)

  const handleClickDeleteReview = async () => {}
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getReview(`from=${(page - 2) * 10}&size=10&sort=createdAt:desc`)
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
      const result = await getReview(`from=${page * 10}&size=10&sort=createdAt:desc`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  return (
    <div className="mt-4 flex w-full">
      <div className="w-full">
        <div className="mb-4 flex w-full items-center justify-between">
          <p className="text-sm">총 {totalNumber} 개</p>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null && (
              <div className="flex gap-2">
                <button
                  className="rounded-lg bg-red-600 px-3 py-2 text-textPrimary"
                  onClick={handleClickDeleteReview}
                >
                  삭제
                </button>
                <button
                  className="rounded-lg bg-bgHeader px-3 py-2"
                  onClick={() => {
                    setReviewForm(data[selectedRowIndex])
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
                    {row[key]}
                  </td>
                ))}
              </tr>
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
    </div>
  )
}
