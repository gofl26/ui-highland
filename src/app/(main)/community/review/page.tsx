import ReviewList from '@/components/list/ReviewList'
import { getReview } from '@/serverActions/reviews'

export default async function Review() {
  const review = await getReview()
  if (!review) return null
  return (
    <div className="flex flex-col w-full items-center text-textDefault overflow-auto">
      <ReviewList reviewInfo={review} />
    </div>
  )
}
