import { NextResponse } from 'next/server'
import { backendFetch, extractToken, setAuthCookie } from '@/lib/server-api'

export async function POST(req: Request) {
  const body = await req.json()
  const res = await backendFetch('/user/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const raw = await res.text()

  if (!res.ok) {
    return NextResponse.json({ message: raw || 'Invalid credentials' }, { status: res.status })
  }

  const token = extractToken(raw)
  console.log('[login BFF] raw:', raw.substring(0, 50), 'token:', token?.substring(0, 20))
  if (!token) {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 })
  }

  const response = NextResponse.json({ email: body.email })
  setAuthCookie(response, token)
  return response
}
