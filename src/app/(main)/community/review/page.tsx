import ReviewList from '@/components/list/ReviewList'
import { getReview } from '@/serverActions/reviews'

export default async function Review() {
  const review = await getReview()
  if (!review) return null
  return (
    <div className="flex w-full flex-col items-center overflow-auto text-textDefault">
      <ReviewList reviewInfo={review} />
    </div>
  )
}
