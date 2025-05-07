'use server'
import { authFetch } from '@/lib/authFetch'
import type { inquiryResponse } from '@/types/inquiry'

const API_URL = process.env.API_URL || ''

export async function getInquiry(
  query: string = '',
): Promise<{ rows: inquiryResponse[]; total: number } | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/inquiries/get?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: inquiryResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

interface createInquiryBody {
  productId: string
  inquiryCategory: string
  inquiryTitle: string
  inquiryDesc: string
  isPublic: boolean
}
export async function createInquiry(body: createInquiryBody) {
  try {
    const result = await authFetch(`${API_URL}/api/inquiries/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: inquiryResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}
interface updateInquiryBody {
  id: string
  productId: string
  inquiryCategory: string
  inquiryTitle: string
  inquiryDesc: string
  isPublic: boolean
  inquiryAnswer?: string
  answerAt?: string
}
export async function updateInquiry(body: updateInquiryBody) {
  try {
    const result = await authFetch(`${API_URL}/api/inquiries/update`, {
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

export async function deleteInquiry(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/inquiries/delete`, {
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
