'use server'
import { authFetch } from '@/lib/authFetch'
import type { faqResponse } from '@/types/faq'

const API_URL = process.env.API_URL || ''

export async function getFaq(
  query: string = '',
): Promise<{ rows: faqResponse[]; total: number } | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/faq/get?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total = 0 },
    }: { data: { rows: faqResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

interface CreateFaqBody {
  faqQuestion: string
  faqAnswer: string
  faqCategory: string
}

export async function createFaq(body: CreateFaqBody): Promise<faqResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/faq/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: faqResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateFaqBody {
  id: string
  faqQuestion: string
  faqAnswer: string
  faqCategory: string
}
export async function updateFaq(body: UpdateFaqBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/faq/update`, {
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

export async function deleteFaq(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/faq/delete`, {
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
