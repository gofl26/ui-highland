import FaqListGrid from '@/components/grid/FaqListGrid'
import { getFaq } from '@/serverActions/faq'

export default async function Faq() {
  const faq = await getFaq()
  if (!faq) return null
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">자주 묻는 질문</p>
      <FaqListGrid faqInfo={faq} />
    </div>
  )
}
