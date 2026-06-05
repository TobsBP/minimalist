export type UserRole = 'ADMIN' | 'AGENT' | 'CUSTOMER'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
  cpf: string
  dateOfBirth: string // ISO date (YYYY-MM-DD)
  phone: string
  address: string
  nationality: string
}

export interface AuthUser {
  email: string
}
