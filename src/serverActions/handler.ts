'use server'
import { serverFetch } from '@/lib/serverFetch'
import type { userVerify } from '@/types/users'
import type { categoryResponse } from '@/types/category'
import type { siteResponse } from '@/types/sites'
import type { menuResponse } from '@/types/menu'

const API_URL = process.env.API_URL || ''

export async function checkEmailDuplicate(email: string) {
  try {
    const result = await fetch(`${API_URL}/api/users/checkEmail?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function getUserInfo(): Promise<userVerify | undefined> {
  try {
    const result = await serverFetch(`${API_URL}/api/auth/tokenVerify`, {
      method: 'GET',
    })
    const { user }: { user: userVerify } = await result.json()
    return user
  } catch (error) {
    return
  }
}

export async function getCategories(): Promise<categoryResponse[] | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/auth/tokenVerify`, {
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

export async function getSite(): Promise<siteResponse | undefined> {
  try {
    const result = await fetch(`${API_URL}/api/sites/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const {
      data: { rows = [] },
    }: { data: { rows: siteResponse[] } } = await result.json()
    if (rows.length > 0) return rows[0]
    else return
  } catch (error) {
    return
  }
}

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

export async function updateSite(formData: FormData): Promise<boolean | undefined> {
  try {
    const result = await serverFetch(`${API_URL}/api/sites/update`, {
      method: 'PUT',
      body: formData,
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function createSite(formData: FormData): Promise<siteResponse | undefined> {
  try {
    const result = await serverFetch(`${API_URL}/api/sites/create`, {
      method: 'POST',
      body: formData,
    })
    const {
      data: { rows = [] },
    }: { data: { rows: siteResponse[] } } = await result.json()
    if (rows.length > 0) return rows[0]
    else return
  } catch (error) {
    return
  }
}
