// src/types/domain/quiz.ts
import { ID, Timestamp } from '../core'
import { Question } from './question'

export interface Quiz {
  id: ID
  title: string
  description: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
  questions?: Question[]
}

export interface QuizPreview {
  id: ID
  title: string
  description: string | null
  questionsCount: number
  createdAt: Timestamp
}
