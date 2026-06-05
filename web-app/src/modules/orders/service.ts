import { apiFetch } from '@/lib/http'
import type { CheckoutInput, Order, OrderSummary } from './types'

export function listOrders(): Promise<OrderSummary[]> {
  return apiFetch<OrderSummary[]>('/api/orders')
}

export function getOrder(id: number): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`)
}

export function checkout(input: CheckoutInput): Promise<Order> {
  return apiFetch<Order>('/api/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function cancelOrder(id: number): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}/cancel`, { method: 'PATCH' })
}
