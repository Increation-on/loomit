// src/types/api/quiz.ts
import { ID } from '../core'
import { Quiz, QuizPreview } from '../domain'
import { PublicQuestion } from '../domain/question'

export interface StartQuizResponse {
  quiz: QuizPreview
  questions: PublicQuestion[]
  attemptId: ID
}

export interface SubmitAnswerRequest {
  attemptId: ID
  questionId: ID
  selectedOptionId: string
}

export interface SubmitAnswerResponse {
  isCorrect: boolean
  correctOptionId: string
  explanation: string | null
}

export interface FinishQuizResponse {
  attemptId: ID
  score: number
  totalQuestions: number
  percentage: number
  answers: Array<{
    questionId: ID
    selectedOptionId: string
    isCorrect: boolean
  }>
}

// Админка
export interface AdminQuizCreate {
  title: string
  description?: string
  questions: Array<{
    text: string
    options: Array<{ id: string; text: string }>
    correctOptionId: string
    order: number
    explanation?: string
  }>
}

export type AdminQuizUpdate = Partial<AdminQuizCreate>

export interface AdminQuizListResponse {
  quizzes: Quiz[]
  total: number
}