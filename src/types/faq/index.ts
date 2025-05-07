export type faqResponse = {
  id: string
  faqQuestion: string
  faqAnswer: string
  faqCategory: string
  updatedAt?: string
  createdAt?: string
}

export type faqForm = {
  id?: string
  faqQuestion: string
  faqAnswer: string
  faqCategory: string
}
