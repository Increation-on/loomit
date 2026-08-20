// src/types/core/base.ts
export type ID = string
export type Timestamp = string // ISO формат
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Utility types для работы с массивами
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// Статусы загрузки
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

// Режим синхронизации
export type SyncStatus = 'pending' | 'synced' | 'failed'
