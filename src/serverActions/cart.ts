'use server'
import { authFetch } from '@/lib/authFetch'
import type { cartResponse } from '@/types/cart'

const API_URL = process.env.API_URL || ''

export async function getCart(): Promise<cartResponse[] | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/carts/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [] },
    }: { data: { rows: cartResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface CreateCartBody {
  productId: string
  cartQuantity: number
}

export async function createCart(body: CreateCartBody): Promise<cartResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/carts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: cartResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateCartBody {
  cartQuantity: number
}
export async function updateCart(body: UpdateCartBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/carts/update`, {
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

export async function deleteCart(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/carts/delete`, {
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
