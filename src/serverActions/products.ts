'use server'
import { authFetch } from '@/lib/authFetch'
import type { productResponse } from '@/types/product'

const API_URL = process.env.API_URL || ''

export async function getProduct(
  query: string = '',
): Promise<{ rows: productResponse[]; total: number } | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/products/get?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: productResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

export async function createProduct(form: FormData) {
  try {
    const result = await authFetch(`${API_URL}/api/products/create`, {
      method: 'POST',
      body: form,
    })
    const {
      data: { rows = [] },
    }: { data: { rows: productResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const result = await authFetch(`${API_URL}/api/products/update`, {
      method: 'PUT',
      body: formData,
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function deleteProduct(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/products/delete`, {
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
