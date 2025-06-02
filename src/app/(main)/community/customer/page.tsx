import { auth } from '@/auth'
import CustomerList from '@/components/list/CustomerList'
import { getFaq } from '@/serverActions/faq'
import { getInquiry } from '@/serverActions/inquiries'
import { getProduct } from '@/serverActions/products'

export default async function Customer() {
  const token = await auth()
  const faq = await getFaq()
  const inquiry = await getInquiry()
  const product = await getProduct()
  if (!faq || !inquiry || !product) return null
  return (
    <div className="flex w-full flex-col items-center overflow-auto text-textDefault">
      <CustomerList faqInfo={faq} inquiryInfo={inquiry} productInfo={product} token={token} />
    </div>
  )
}
