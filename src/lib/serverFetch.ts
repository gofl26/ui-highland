import { auth } from '@/auth'

export async function serverFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await auth()

  if (!token) {
    throw new Error('No access token found. User may not be authenticated.')
  }

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
