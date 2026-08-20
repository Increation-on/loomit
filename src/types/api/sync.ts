// src/types/api/sync.ts
import { ID } from '../core'

export interface SyncAttemptsRequest {
  attempts: Array<{
    id?: ID
    quizId: ID
    guestId: string
    score: number
    totalQuestions: number
    answers: Array<{
      questionId: ID
      selectedOptionId: string
      isCorrect: boolean
    }>
    createdAt: string
  }>
}

export interface SyncAttemptsResponse {
  synced: Array<{ localId?: ID; serverId: ID }>
  failed: Array<{ localId?: ID; error: string }>
}

export interface PendingSyncAction {
  id: ID
  type: 'CREATE_ATTEMPT' | 'UPDATE_PROFILE'
  payload: unknown
  createdAt: string
}
