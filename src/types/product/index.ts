export type productResponse = {
  id: string
  userId: string
  categoryId: string
  productPrice: number
  productState: string
  productQuality: string
  productOrder: number
  productName: string
  productsFile: string
  updatedAt?: string
  createdAt?: string
}

export type productForm = {
  id?: string
  categoryId: string
  productPrice: number
  productState: string
  productQuality: string
  productOrder: number
  productName: string
  productsFile: string
}
