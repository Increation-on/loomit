// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h1>Что-то пошло не так</h1>
      <p>{error.message || 'Произошла непредвиденная ошибка'}</p>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  )
}
