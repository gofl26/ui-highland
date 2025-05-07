'use server'
import { authFetch } from '@/lib/authFetch'
import type { reviewResponse } from '@/types/review'

const API_URL = process.env.API_URL || ''

export async function getReview(
  query: string = '',
): Promise<{ rows: reviewResponse[]; total: number } | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/reviews/get?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: reviewResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

export async function createReview(form: FormData) {
  try {
    const result = await authFetch(`${API_URL}/api/reviews/create`, {
      method: 'POST',
      body: form,
    })
    const {
      data: { rows = [] },
    }: { data: { rows: reviewResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

export async function updateReview(formData: FormData) {
  try {
    const result = await authFetch(`${API_URL}/api/reviews/update`, {
      method: 'PUT',
      body: formData,
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function deleteReview(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/reviews/delete`, {
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
