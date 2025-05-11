'use client'
import { useState } from 'react'
import { noticeResponse } from '@/types/notice'
type Row = {
  noticeCategory: string
  noticeTitle: string
  noticeActive: string
  createdAt: string
}
const columns: { key: keyof Row; label: string }[] = [
  { key: 'noticeCategory', label: '유형' },
  { key: 'noticeTitle', label: '제목' },
  { key: 'createdAt', label: '등록일' },
]
interface props {
  noticeInfo: { rows: noticeResponse[]; total: number }
}
export default function NoticeList({ noticeInfo }: props) {
  const { rows, total } = noticeInfo
  const [data, setData] = useState(rows)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  return (
    <div className="flex flex-col items-center w-full px-20">
      <p className="flex justify-center mt-12 text-3xl font-semibold">커뮤니티</p>
      <div className="flex justify-center gap-6 mt-12">
        <button className="flex justify-center bg-bgPrimary text-textPrimary w-28 rounded-full px-3 py-2">
          공지사항
        </button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">고객센터</button>
        <button className="flex justify-center border w-28 rounded-full px-3 py-2">상품후기</button>
      </div>
      <div className="w-full mt-12">
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
      </div>
    </div>
  )
}
