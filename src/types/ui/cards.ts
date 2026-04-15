// src/types/ui/cards.ts
import { ReactNode } from 'react'
import { ID } from '../core'
import { QuizPreview } from '../domain'

export interface CardProps {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  className?: string
  onClick?: () => void
}

export interface QuizCardProps {
  quiz: QuizPreview
  onStart?: (quizId: ID) => void
  onEdit?: (quizId: ID) => void
  onDelete?: (quizId: ID) => void
  isAdmin?: boolean
}

export interface QuestionCardProps {
  question: {
    id: ID
    text: string
    options: Array<{ id: string; text: string }>
    order: number
    totalQuestions: number
  }
  selectedOptionId?: string
  onSelect: (optionId: string) => void
  onSubmit: () => void
  isLast: boolean
  isLoading?: boolean
}

export interface ResultCardProps {
  score: number
  totalQuestions: number
  percentage: number
  onRetry?: () => void
  onBackToCatalog?: () => void
  onViewAnswers?: () => void
}