export type inquiryResponse = {
  id: string
  userId: string
  userName: string
  productId: string
  productName: string
  inquiryCategory: string
  inquiryTitle: string
  inquiryDesc: string
  inquiryAnswer: string
  isPublic: boolean
  answerAt?: string
  updatedAt?: string
  createdAt?: string
}

export type inquiryForm = {
  id?: string
  productId: string
  inquiryCategory: string
  inquiryTitle: string
  inquiryDesc: string
  isPublic: boolean
  inquiryAnswer?: string
  answerAt?: string
  updatedAt?: string
  createdAt?: string
}
