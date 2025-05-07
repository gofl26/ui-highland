'use server'
import { authFetch } from '@/lib/authFetch'
import type { categoryResponse } from '@/types/category'

const API_URL = process.env.API_URL || ''

export async function getCategory(): Promise<categoryResponse[] | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/categories/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [] },
    }: { data: { rows: categoryResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface CreateCategoryBody {
  categoryName: string
  categoryUrl: string
  active: boolean
}

export async function createCategory(body: CreateCategoryBody) {
  try {
    const result = await authFetch(`${API_URL}/api/categories/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: categoryResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateCategoryBody {
  id: string
  categoryName: string
  categoryUrl: string
  active: boolean
}
export async function updateCategory(body: UpdateCategoryBody) {
  try {
    const result = await authFetch(`${API_URL}/api/categories/update`, {
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

export async function deleteCategory(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/categories/delete`, {
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
