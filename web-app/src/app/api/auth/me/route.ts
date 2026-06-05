import { NextResponse } from 'next/server'
import { decodeJwt, getToken } from '@/lib/server-api'

export async function GET() {
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  const payload = decodeJwt(token)
  if (!payload?.sub) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({ email: payload.sub })
}
