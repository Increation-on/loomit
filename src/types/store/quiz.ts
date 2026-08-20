// src/types/store/quiz.ts
import { LoadingStatus } from '../core'
import { ID } from '../core'
import { Quiz, Question } from '../domain'
import { UserAnswer } from '../domain/attempt'

export interface QuizState {
  currentQuiz: Quiz | null
  questions: Question[]
  currentIndex: number
  answers: Record<ID, UserAnswer>
  attemptId: ID | null
  status: LoadingStatus
  isFinished: boolean
  result: {
    score: number
    totalQuestions: number
    percentage: number
  } | null
  error: string | null
}

export interface StartQuizPayload {
  quiz: Quiz
  questions: Question[]
  attemptId: ID
}

export interface AnswerQuestionPayload {
  questionId: ID
  answer: UserAnswer
}

export interface FinishQuizPayload {
  score: number
  totalQuestions: number
  percentage: number
  answers: UserAnswer[]
}
