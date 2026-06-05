import { NextResponse } from 'next/server'
import { backendFetch } from '@/lib/server-api'

export async function GET() {
  const res = await backendFetch('/cart')
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ message: text || 'Cart error' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE() {
  const res = await backendFetch('/cart', { method: 'DELETE' })
  return new NextResponse(null, { status: res.status })
}
