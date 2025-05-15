import CustomerList from '@/components/list/CustomerList'
import { getFaq } from '@/serverActions/faq'
import { getInquiry } from '@/serverActions/inquiries'

export default async function Customer() {
  const faq = await getFaq()
  const inquiry = await getInquiry()
  if (!faq || !inquiry) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <CustomerList faqInfo={faq} inquiryInfo={inquiry} />
    </div>
  )
}
