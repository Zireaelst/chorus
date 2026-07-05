import { cookies } from 'next/headers'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/v1'

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  // In a real implementation, we would extract the WorkOS session token.
  // For this MVP, we simulate passing an Authorization header or Cookie.
  const token = cookieStore.get('chorus_session')?.value

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // To simulate authenticated requests for testing without a real session,
  // we could optionally inject a mock header here.
  // headers.set('x-mock-role', 'sponsor') 

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API error: ${response.statusText}`)
  }

  return response.json()
}
