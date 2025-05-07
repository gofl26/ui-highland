'use server'
import { authFetch } from '@/lib/authFetch'
import type { menuResponse } from '@/types/menu'

const API_URL = process.env.API_URL || ''

export async function getMenu(): Promise<menuResponse[] | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/menu/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [] },
    }: { data: { rows: menuResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface CreateMenuBody {
  menuName: string
  menuUrl: string
  menuOrder: number
  active: boolean
}

export async function createMenu(body: CreateMenuBody): Promise<menuResponse[] | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/menu/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const {
      data: { rows = [] },
    }: { data: { rows: menuResponse[] } } = await result.json()
    return rows
  } catch (error) {
    return
  }
}

interface UpdateMenuBody {
  id: string
  menuName: string
  menuUrl: string
  menuOrder: number
  active: boolean
}
export async function updateMenu(body: UpdateMenuBody): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/menu/update`, {
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

export async function deleteMenu(id: string): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/menu/delete`, {
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
