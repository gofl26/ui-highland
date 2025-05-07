import { auth } from '@/auth'

export async function authFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await auth()

  if (!token) {
    throw new Error('No access token found. User may not be authenticated.')
  }

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token.accessToken}`)

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status} ${res.statusText}`)
  }

  return res
}
