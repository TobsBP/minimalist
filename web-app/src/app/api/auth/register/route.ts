import { NextResponse } from 'next/server'
import { backendFetch, extractToken, setAuthCookie } from '@/lib/server-api'

export async function POST(req: Request) {
  const body = await req.json()
  console.log('[register BFF] body:', JSON.stringify(body))
  const res = await backendFetch('/user/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const raw = await res.text()

  if (!res.ok) {
    return NextResponse.json({ message: raw || 'Registration failed' }, { status: res.status })
  }

  const token = extractToken(raw)
  if (!token) {
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }

  const response = NextResponse.json({ email: body.email })
  setAuthCookie(response, token)
  return response
}
