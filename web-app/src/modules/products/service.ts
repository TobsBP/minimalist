import { apiFetch } from '@/lib/http'
import type { AddProductInput, Product } from './types'

export function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/api/products')
}

export function getProduct(id: number): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`)
}

export function createProduct(input: AddProductInput): Promise<string> {
  return apiFetch<string>('/api/products', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteProduct(id: number): Promise<string> {
  return apiFetch<string>(`/api/products/${id}`, { method: 'DELETE' })
}
