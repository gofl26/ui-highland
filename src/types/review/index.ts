export type reviewResponse = {
  id: string
  userId: string
  productId: string
  orderItemsId: string
  reviewStar: string
  reviewComment: string
  reviewAnswer: string
  reviewsFile: string
  updatedAt?: string
  createdAt?: string
}

export type reviewForm = {
  id?: string
  productId: string
  orderItemsId: string
  reviewStar: string
  reviewComment: string
  reviewAnswer: string
  reviewsFile: string
}
