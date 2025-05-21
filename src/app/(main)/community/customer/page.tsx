import { getFaq } from '@/serverActions/faq'
import { getInquiry } from '@/serverActions/inquiries'
import { auth } from '@/auth'
import CustomerList from '@/components/list/CustomerList'
import { getProduct } from '@/serverActions/products'

export default async function Customer() {
  const token = await auth()
  const faq = await getFaq()
  const inquiry = await getInquiry()
  const product = await getProduct()
  if (!faq || !inquiry || !product) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <CustomerList faqInfo={faq} inquiryInfo={inquiry} productInfo={product} token={token} />
    </div>
  )
}
