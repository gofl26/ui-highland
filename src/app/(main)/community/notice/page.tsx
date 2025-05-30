import NoticeList from '@/components/list/NoticeList'
import { getNotice } from '@/serverActions/notice'

export default async function Notice() {
  const notice = await getNotice('from=0&size=10')
  if (!notice) return null
  return (
    <div className="flex w-full flex-col items-center overflow-auto text-textDefault">
      <NoticeList noticeInfo={notice} />
    </div>
  )
}
