// Server-only helpers for the BFF proxy. These read the httpOnly cookie, attach the
// Bearer token, and talk to the Spring backend. Never import this from client components.
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { API_URL, AUTH_COOKIE, TOKEN_MAX_AGE } from './config'

export async function getToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(AUTH_COOKIE)?.value ?? null
}

/** Forward a request to the backend, attaching the JWT from the cookie when present. */
export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getToken()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' })
}

/** Decode a JWT payload without verifying the signature (the backend already verified it). */
export function decodeJwt(token: string): { sub?: string; exp?: number } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = Buffer.from(payload, 'base64').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Extract a token from a backend auth response. /user/login returns `{ token }`,
 * while /user/register returns the token as a plain string.
 */
export function extractToken(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const parsed = JSON.parse(trimmed)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object' && typeof parsed.token === 'string') {
      return parsed.token
    }
  } catch {
    // Plain token string (register endpoint) — fall through.
  }
  return trimmed.split('.').length === 3 ? trimmed : null
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  })
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}
