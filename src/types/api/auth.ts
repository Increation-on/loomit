// src/types/api/auth.ts
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
  }
  guestId?: string
}
