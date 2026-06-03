export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface OrderSummary {
  id: number
  status: OrderStatus
  total: number
  shippingAddress: string
  createdAt: string
}

export interface Order {
  id: number
  userEmail: string
  status: OrderStatus
  total: number
  shippingAddress: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface CheckoutInput {
  shippingAddress: string
}
