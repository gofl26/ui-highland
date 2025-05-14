import NoticeList from '@/components/list/NoticeList'
import { getNotice } from '@/serverActions/notice'

export default async function Notice() {
  const notice = await getNotice('from=0&size=10')
  if (!notice) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <NoticeList noticeInfo={notice} />
    </div>
  )
}
