export type orderResponse = {
  id: string
  userId: string
  payMethod: string
  addressDetail: string
  address: string
  bankCode: string
  accountNumber: string
  deliveryCost: number
  trackingNumber: string
  orderAmount: number
  orderQuantity: number
  productFile: string
  productName: string
  productPrice: string
  orderStatus: string
  phoneNumber: string
  recipient: string
  updatedAt: string
  createdAt: string
}

export type orderItemResponse = {
  id: string
  userId: string
  productId: string
  orderId: string
  orderQuantity: number
  productPrice: string
  updatedAt?: string
  createdAt?: string
}
