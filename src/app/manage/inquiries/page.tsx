import { getInquiry } from '@/serverActions/inquiries'
import InquiryListGrid from '@/components/grid/InquiryListGrid'

export default async function Inquiries() {
  const inquiry = await getInquiry()
  if (!inquiry) return null
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">문의 관리</p>
      <InquiryListGrid inquiryInfo={inquiry} />
    </div>
  )
}
