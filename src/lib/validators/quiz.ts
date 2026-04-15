// src/lib/validators/quiz.ts
import { z } from 'zod'

export const quizSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Название обязательно').max(200),
  description: z.string().max(1000).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const createQuizSchema = quizSchema.pick({
  title: true,
  description: true
})

export const updateQuizSchema = createQuizSchema.partial()

export type Quiz = z.infer<typeof quizSchema>
export type CreateQuiz = z.infer<typeof createQuizSchema>
export type UpdateQuiz = z.infer<typeof updateQuizSchema>