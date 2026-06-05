import { apiFetch } from '@/lib/http'
import type { AddItemInput, Cart } from './types'

export function getCart(): Promise<Cart> {
  return apiFetch<Cart>('/api/cart')
}

export function addItem(input: AddItemInput): Promise<Cart> {
  return apiFetch<Cart>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateItem(itemId: number, quantity: number): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

export function removeItem(itemId: number): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/items/${itemId}`, { method: 'DELETE' })
}

export async function clearCart(): Promise<void> {
  await apiFetch('/api/cart', { method: 'DELETE' })
}
