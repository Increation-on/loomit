// src/types/store/sync.ts
import { ID } from '../core'

export interface PendingAction {
  id: ID
  type: 'CREATE_ATTEMPT' | 'UPDATE_PROFILE' | 'SYNC_ATTEMPTS'
  payload: unknown
  createdAt: number
  retryCount: number
}

export interface SyncState {
  pendingActions: PendingAction[]
  isSyncing: boolean
  lastSync: number | null
  error: string | null
}

export interface AddPendingActionPayload {
  type: PendingAction['type']
  payload: unknown
}

export interface UpdateSyncStatusPayload {
  id: ID
  retryCount?: number
}