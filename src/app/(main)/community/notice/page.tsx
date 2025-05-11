import Image from 'next/image'
import NoticeList from '@/components/list/NoticeList'
import { getNotice } from '@/serverActions/notice'

export default async function Notice() {
  const notice = await getNotice()
  if (!notice) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <NoticeList noticeInfo={notice} />
    </div>
  )
}
