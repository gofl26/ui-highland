'use client'
import moment from 'moment'
import { ReactNode } from 'react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-8 flex h-[700px] w-full max-w-4xl flex-col rounded-lg bg-white p-6 shadow-lg">
        <div className="flex">
          <button className="font-semibold text-textSuccess" onClick={() => onClose()}>
            {'공지사항 >'}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-4 text-3xl font-bold">
          <span className="rounded-lg bg-bgPrimary px-3 py-1 text-base text-textPrimary">
            {notice.noticeCategory}
          </span>
          {notice.noticeTitle}
        </p>
        <p className="ml-2 mt-2 text-sm text-textDefault">
          {moment(notice.createdAt).format('YYYY-MM-DD HH:mm')}
        </p>
        <p className="h-1 border-b border-borderDefault"></p>
        <div className="custom-scroll mt-4 flex w-full flex-1 flex-col overflow-y-auto px-8">
          {children}
        </div>
        <div className="flex w-full justify-center">
          <button
            className="w-20 rounded-lg bg-bgPrimary px-3 py-1 font-semibold text-textPrimary"
            onClick={() => onClose()}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
