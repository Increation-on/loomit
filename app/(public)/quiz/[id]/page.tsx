// app/(public)/quiz/[id]/page.tsx
export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Прохождение квиза {id} в разработке</div>
}