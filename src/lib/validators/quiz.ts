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

export const adminQuizCreateSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().min(1, 'Категория обязательна'),
  level: z.enum(['JUNIOR', 'MIDDLE', 'SENIOR']).default('JUNIOR'),
  questions: z.array(
    z.object({
      text: z.string().min(1, 'Текст вопроса обязателен'),
      options: z.array(
        z.object({
          id: z.string(),
          text: z.string().min(1, 'Вариант обязателен'),
        })
      ).length(4, 'Должно быть ровно 4 варианта'),
      correctOptionId: z.string().min(1, 'Выберите правильный вариант'),
      explanation: z.string().optional(), // ✅ добавляем поле
    })
  ).min(1, 'Минимум 1 вопрос'),
});

export type Quiz = z.infer<typeof quizSchema>
export type CreateQuiz = z.infer<typeof createQuizSchema>
export type UpdateQuiz = z.infer<typeof updateQuizSchema>