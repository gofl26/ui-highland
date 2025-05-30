'use client'
import moment from 'moment'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import NoticeModal from '@/components/modals/NoticeModal'
import TiptapViewer from '@/lib/tiptapViewer/TiptapVIewer'
import { getNotice } from '@/serverActions/notice'
import { noticeResponse } from '@/types/notice'

type Row = {
  noticeCategory: string
  noticeTitle: string
  noticeActive: string
  createdAt: string
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'noticeCategory', label: '유형', width: '' },
  { key: 'noticeTitle', label: '제목', width: 'w-full' },
  { key: 'createdAt', label: '등록일', width: '' },
]
interface props {
  noticeInfo: { rows: noticeResponse[]; total: number }
}
export default function NoticeList({ noticeInfo }: props) {
  const { rows, total } = noticeInfo
  const pageSize = 10

  const [data, setData] = useState(rows)
  const [page, setPage] = useState(1)
  const [totalNumber, setTotalNumber] = useState(0)
  const [currentPage, setCurrentPage] = useState('')
  const [notice, setNotice] = useState<noticeResponse>()
  const [openNoticeModal, setOpenNoticeModal] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()

  const formatCellValue = (key: keyof Row, value: string | boolean) => {
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    return value
  }
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getNotice(`from=${(page - 2) * 10}&size=10`)
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
      const result = await getNotice(`from=${page * 10}&size=10`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  useEffect(() => {
    setCurrentPage(pathname)
    setTotalNumber(total)
  }, [pathname, total])
  return (
    <div className="flex w-full flex-col items-center px-20">
      <p className="mt-12 flex justify-center text-3xl font-semibold">커뮤니티</p>
      <div className="mt-12 flex justify-center gap-6">
        <button
          className={`flex w-28 items-center justify-center rounded-full px-3 py-2 ${currentPage === '/community/notice' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/notice')}
        >
          공지사항
        </button>
        <button
          className={`flex w-28 items-center justify-center rounded-full px-3 py-2 ${currentPage === '/community/customer' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/customer')}
        >
          고객센터
        </button>
        <button
          className={`flex w-28 items-center justify-center rounded-full px-3 py-2 ${currentPage === '/community/review' ? 'bg-bgPrimary text-textPrimary' : 'border'}`}
          onClick={() => router.push('/community/review')}
        >
          상품후기
        </button>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <div className="mb-4 flex w-full items-center">
          <p className="text-sm">총 {totalNumber} 개</p>
        </div>
        {/* Table */}
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
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer even:bg-gray-50 hover:bg-gray-100`}
                onClick={() => {
                  setNotice(row)
                  console.info('🚀 row:', row)
                  setOpenNoticeModal(true)
                }}
              >
                {columns.map(({ key, width }) => (
                  <td key={key} className={`truncate border px-4 py-2 ${width}`}>
                    {formatCellValue(key, row[key]!)}
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
      {openNoticeModal && notice && (
        <NoticeModal
          isOpen={openNoticeModal}
          onClose={() => setOpenNoticeModal(false)}
          notice={notice}
        >
          <TiptapViewer htmlContent={notice.noticeDesc} />
        </NoticeModal>
      )}
    </div>
  )
}
