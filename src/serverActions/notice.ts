'use server'
import { authFetch } from '@/lib/authFetch'
import type { noticeResponse } from '@/types/notice'

const API_URL = process.env.API_URL || ''

export async function getNotice(
  query: string = '',
): Promise<{ rows: noticeResponse[]; total: number } | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/notice/get?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [], total },
    }: { data: { rows: noticeResponse[]; total: number } } = await result.json()
    return { rows, total }
  } catch (error) {
    return
  }
}

interface createNoticeBody {
  noticeTitle: string
  noticeCategory: string
  noticeDesc: string
  noticeActive: boolean
}
export async function createNotice(body: createNoticeBody) {
  try {
    const result = await authFetch(`${API_URL}/api/notice/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: noticeResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}
interface updateNoticeBody {
  id: string
  noticeTitle: string
  noticeCategory: string
  noticeDesc: string
  noticeActive: boolean
}
export async function updateNotice(body: updateNoticeBody) {
  try {
    const result = await authFetch(`${API_URL}/api/notice/update`, {
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

export async function deleteNotice(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/notice/delete`, {
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
