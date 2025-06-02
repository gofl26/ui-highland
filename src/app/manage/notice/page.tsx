import NotceListGrid from '@/components/grid/NoticeListGrid'
import { getNotice } from '@/serverActions/notice'

export default async function Notice() {
  const notice = await getNotice()
  if (!notice) return null
  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">공지사항</p>
      <NotceListGrid noticeInfo={notice} />
    </div>
  )
}
