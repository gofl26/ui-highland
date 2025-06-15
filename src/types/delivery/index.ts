export type deliveryResponse = {
  id: string
  userId: string
  deliveryName: string
  deliveryRecipient: string
  deliveryPhoneNumber: string
  deliveryAddress: string
  deliveryDetailAddress: string
  deliveryDefault: boolean
  updatedAt?: string
  createdAt?: string
}
export type deliveryForm = {
  id: string
  deliveryName: string
  deliveryRecipient: string
  deliveryPhoneNumber: string
  deliveryAddress: string
  deliveryDetailAddress: string
  deliveryDefault: boolean
}
