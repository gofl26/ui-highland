'use server'
import { authFetch } from '@/lib/authFetch'
import type { orderItemResponse } from '@/types/order'

const API_URL = process.env.API_URL || ''

export async function getOrderItem(): Promise<
  { rows: orderItemResponse[]; total: number } | undefined
> {
  try {
    const result = await authFetch(`${API_URL}/api/orderItems/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: orderItemResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

// interface CreateOrderBody {
//   payMethod: string
//   addressDetail: string
//   address: string
//   bankCode: string
//   accountNumber: string
//   deliveryCost: string
//   trackingNumber: string
//   orderAmount: number
//   orderStatus: string
//   phoneNumber: string
//   recipient: string
// }

// export async function createOrder(body: CreateOrderBody): Promise<orderResponse[] | undefined> {
//   try {
//     const result = await authFetch(`${API_URL}/api/orders/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     })
//     const {
//       data: { rows = [] },
//     }: { data: { rows: orderResponse[] } } = await result.json()
//     return rows
//   } catch (error) {
//     return
//   }
// }

interface UpdateOrderItemBody {
  id: string
  productId: string
  orderId: string
  orderQuantity: string
  productPrice: string
}
export async function updateOrderItem(body: UpdateOrderItemBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orderItems/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function deleteOrderItem(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orderItems/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}
