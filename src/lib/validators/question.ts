// src/lib/validators/question.ts
import { z } from 'zod'

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Текст варианта обязателен')
})

const baseQuestionSchema = z.object({
  id: z.string().cuid(),
  text: z.string().min(1, 'Текст вопроса обязателен').max(500),
  options: z.array(optionSchema).min(2, 'Минимум 2 варианта ответа'),
  correctOptionId: z.string(),
  order: z.number().int().min(0),
  explanation: z.string().max(1000).nullable().optional(),
  quizId: z.string().cuid()
})

export const questionSchema = baseQuestionSchema.refine(
  (data) => data.options.some(opt => opt.id === data.correctOptionId),
  { message: 'Правильный ответ должен быть среди вариантов', path: ['correctOptionId'] }
)

export const createQuestionSchema = baseQuestionSchema.omit({ id: true })

export const updateQuestionSchema = createQuestionSchema.partial()

export type Question = z.infer<typeof questionSchema>
export type CreateQuestion = z.infer<typeof createQuestionSchema>
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>
