import ReviewListGrid from '@/components/grid/ReviewListGrid'
import { getReview } from '@/serverActions/reviews'

export default async function Faq() {
  const reviews = await getReview('sort=createdAt:desc')
  if (!reviews) return null
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">후기 관리</p>
      <ReviewListGrid reviewInfo={reviews} />
    </div>
  )
}
