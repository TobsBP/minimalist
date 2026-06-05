import { NextResponse } from 'next/server'
import { backendFetch } from '@/lib/server-api'

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await backendFetch(`/orders/${id}/cancel`, { method: 'PATCH' })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
