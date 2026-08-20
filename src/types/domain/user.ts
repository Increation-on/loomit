// src/types/domain/user.ts
import { ID, Timestamp } from '../core'

export interface User {
  id: ID
  email: string
  name: string | null
  image: string | null
  createdAt: Timestamp
}

export type PublicUser = Omit<User, 'email'>
