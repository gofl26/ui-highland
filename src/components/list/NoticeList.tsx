'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment'
import { noticeResponse } from '@/types/notice'
import TiptapViewer from '@/lib/tiptapViewer/TiptapVIewer'
import NoticeModal from '@/components/modals/NoticeModal'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { getNotice } from '@/serverActions/notice'

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
      <div className="w-full max-w-4xl mt-12">
        <div className="flex w-full items-center mb-4">
          <p className="text-sm">총 {totalNumber} 개</p>
        </div>
        {/* Table */}
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
                  <td key={key} className={`border px-4 py-2 truncate ${width}`}>
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
