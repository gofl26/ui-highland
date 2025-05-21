'use server'
import { authFetch } from '@/lib/authFetch'
import type { siteResponse } from '@/types/sites'

const API_URL = process.env.API_URL || ''

export async function getSite(): Promise<siteResponse[] | undefined> {
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
    return rows
  } catch (error) {
    return
  }
}

export async function updateSite(formData: FormData): Promise<boolean | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/sites/update`, {
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
    const result = await authFetch(`${API_URL}/api/sites/create`, {
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
