'use server'
import { authFetch } from '@/lib/authFetch'
import type { orderResponse } from '@/types/order'

const API_URL = process.env.API_URL || ''

export async function getOrder(): Promise<{ rows: orderResponse[]; total: number } | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orders/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: orderResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

export interface orderList {
  productId: string
  productPrice: number
  cartQuantity: number
  cartId: string
}
export interface CreateOrderBody {
  payMethod: string
  addressDetail: string
  address: string
  bankCode: string
  accountNumber: string
  orderAmount: number
  phoneNumber: string
  recipient: string
  receipt: boolean
  orderList: orderList[]
}

export async function createOrder(body: CreateOrderBody): Promise<orderResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: orderResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateOrderBody {
  id: string
  payMethod: string
  addressDetail: string
  address: string
  bankCode: string
  accountNumber: string
  deliveryCost: string
  trackingNumber: string
  orderAmount: number
  orderStatus: string
  phoneNumber: string
  recipient: string
}
export async function updateOrder(body: UpdateOrderBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orders/update`, {
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

export async function deleteOrder(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/orders/delete`, {
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
