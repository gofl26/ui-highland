export type noticeResponse = {
  id: string
  userId: string
  noticeCategory: string
  noticeTitle: string
  noticeActive: boolean
  noticeDesc: string
  updatedAt?: string
  createdAt?: string
}

export type noticeForm = {
  id?: string
  noticeCategory: string
  noticeTitle: string
  noticeActive: boolean
  noticeDesc: string
}
