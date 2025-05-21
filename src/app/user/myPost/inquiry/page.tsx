import InquiryList from '@/components/list/InquiryList'
import { getInquiry } from '@/serverActions/inquiries'

export default async function Inquiry() {
  const inquiry = await getInquiry('from=0&size=10')
  if (!inquiry) return null
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">내가 쓴 문의</p>
      <InquiryList inquiryInfo={inquiry} />
    </div>
  )
}
