import { z } from 'zod'

export const quizImportSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .max(200, 'Название не должно превышать 200 символов'),
  description: z
    .string()
    .max(1000, 'Описание не должно превышать 1000 символов')
    .optional(),
  categoryName: z
    .string()
    .min(1, 'Название категории обязательно')
    .max(100, 'Название категории не должно превышать 100 символов'),
  level: z
    .enum(['JUNIOR', 'MIDDLE', 'SENIOR'], {
      message: 'Уровень должен быть JUNIOR, MIDDLE или SENIOR',
    })
    .default('JUNIOR'),
  questions: z
    .array(
      z.object({
        text: z
          .string()
          .min(1, 'Текст вопроса обязателен'),
        options: z
          .array(
            z.object({
              id: z.string().min(1, 'ID варианта обязателен'),
              text: z.string().min(1, 'Текст варианта обязателен'),
            })
          )
          .length(4, 'Должно быть ровно 4 варианта ответа'),
        correctOptionId: z
          .string()
          .min(1, 'Укажите правильный вариант (correctOptionId)'),
        explanation: z.string().optional(),
      })
    )
    .min(1, 'Должен быть минимум 1 вопрос'),

  // Флаги для разрешения конфликта категорий
  forceCategoryId: z.string().optional(),
  forceCreateCategory: z.boolean().optional(),
})

export type QuizImport = z.infer<typeof quizImportSchema>