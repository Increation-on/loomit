// src/lib/validators/attempt.ts
import { z } from 'zod'

const answerSchema = z.object({
  questionId: z.string(),
  selectedOptionId: z.string(),
  isCorrect: z.boolean()
})

export const attemptSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid().nullable().optional(),
  guestId: z.string().nullable().optional(),
  quizId: z.string().cuid(),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  answers: z.array(answerSchema),
  syncStatus: z.enum(['pending', 'synced', 'failed']).default('pending'),
  createdAt: z.date()
})

export const createAttemptSchema = attemptSchema.omit({ 
  id: true, 
  createdAt: true,
  syncStatus: true 
})

export type Attempt = z.infer<typeof attemptSchema>
export type CreateAttempt = z.infer<typeof createAttemptSchema>