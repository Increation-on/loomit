// src/types/domain/question.ts
import { ID } from '../core'

export interface AnswerOption {
  id: string
  text: string
}

export interface Question {
  id: ID
  text: string
  options: AnswerOption[]
  correctOptionId: string
  order: number
  explanation: string | null
  quizId: ID
}

// Для прохождения квиза (без correctOptionId)
export interface PublicQuestion {
  id: ID
  text: string
  options: AnswerOption[]
  order: number
}
