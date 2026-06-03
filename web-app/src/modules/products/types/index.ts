export type Category = 'CERAMICS' | 'FURNITURE' | 'LIGHTING' | 'TEXTILES'

export interface Product {
  id: number
  name: string
  material: string
  price: number
  imageUrl: string
  category: Category
}

export interface AddProductInput {
  name: string
  material: string
  price: number
  imageUrl: string
  category: Category
}
