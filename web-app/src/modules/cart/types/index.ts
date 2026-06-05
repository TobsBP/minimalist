export interface CartItem {
  id: number
  productId: number
  productName: string
  productImageUrl: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Cart {
  id: number
  userEmail: string
  items: CartItem[]
  total: number
}

export interface AddItemInput {
  productId: number
  quantity: number
}
