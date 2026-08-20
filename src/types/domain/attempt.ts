// src/types/domain/attempt.ts
import { ID, Timestamp, SyncStatus } from '../core'

export interface UserAnswer {
  questionId: ID
  selectedOptionId: string
  isCorrect: boolean
}

export interface Attempt {
  id: ID
  userId: ID | null
  guestId: string | null
  quizId: ID
  score: number
  totalQuestions: number
  answers: UserAnswer[]
  syncStatus: SyncStatus
  createdAt: Timestamp
}

export interface AttemptResult {
  score: number
  totalQuestions: number
  percentage: number
  answers: UserAnswer[]
}
