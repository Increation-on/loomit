// app/(admin)/admin/quiz/[id]/page.tsx
export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Редактор квиза {id} в разработке</div>
}