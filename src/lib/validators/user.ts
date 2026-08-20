// src/lib/validators/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  createdAt: z.date()
})

export const createUserSchema = userSchema.pick({
  email: true,
  name: true,
  image: true
})

export const updateUserSchema = createUserSchema.partial()

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
