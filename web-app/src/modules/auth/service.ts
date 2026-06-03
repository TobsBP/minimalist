import { apiFetch } from '@/lib/http'
import type { AuthUser, LoginInput, RegisterInput } from './types'

// Auth service. Talks to the BFF auth routes, which set/clear the httpOnly JWT cookie.

export function login(input: LoginInput): Promise<AuthUser> {
  return apiFetch<AuthUser>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function register(input: RegisterInput): Promise<AuthUser> {
  return apiFetch<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}

/** Returns the current user from the session cookie, or null if not authenticated. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>('/api/auth/me')
  } catch {
    return null
  }
}
