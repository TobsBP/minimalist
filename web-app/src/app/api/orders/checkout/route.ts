import { NextResponse } from 'next/server'
import { backendFetch } from '@/lib/server-api'

export async function POST(req: Request) {
  const body = await req.json()
  const res = await backendFetch('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
