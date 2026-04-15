// src/types/store/auth.ts
import { LoadingStatus } from '../core'
import { User } from '../domain'

export interface AuthState {
  user: User | null
  status: LoadingStatus
  guestId: string | null
  isAuthenticated: boolean
  error: string | null
}

export interface SetUserPayload {
  user: User
}

export interface SetGuestIdPayload {
  guestId: string
}

export interface AuthErrorPayload {
  error: string
}