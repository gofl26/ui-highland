import CustomerList from '@/components/list/CustomerList'
import { getFaq } from '@/serverActions/faq'

export default async function Customer() {
  const faq = await getFaq()
  if (!faq) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <CustomerList faqInfo={faq} />
    </div>
  )
}
