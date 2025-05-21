'use client'
import { ReactNode } from 'react'
import moment from 'moment'
import { noticeResponse } from '@/types/notice'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  notice: noticeResponse
}

export default function NoticeModal({ isOpen, onClose, notice, children }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col w-full h-[700px] bg-white rounded-lg shadow-lg max-w-4xl mx-8 p-6">
        <div className="flex">
          <button className="text-textSuccess font-semibold" onClick={() => onClose()}>
            {'공지사항 >'}
          </button>
        </div>
        <p className="flex items-center mt-2 text-3xl font-bold gap-4">
          <span className="bg-bgPrimary text-textPrimary text-base px-3 py-1 rounded-lg">
            {notice.noticeCategory}
          </span>
          {notice.noticeTitle}
        </p>
        <p className="mt-2 ml-2 text-sm text-textDefault">
          {moment(notice.createdAt).format('YYYY-MM-DD HH:mm')}
        </p>
        <p className="border-b border-borderDefault h-1"></p>
        <div className="flex flex-col flex-1 w-full mt-4 px-8 overflow-y-auto custom-scroll">
          {children}
        </div>
        <div className="flex w-full justify-center">
          <button
            className="w-20 bg-bgPrimary text-textPrimary px-3 py-1 rounded-lg font-semibold"
            onClick={() => onClose()}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
