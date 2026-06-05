import { NextResponse } from 'next/server'
import { backendFetch } from '@/lib/server-api'

export async function GET() {
  const res = await backendFetch('/orders')
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
