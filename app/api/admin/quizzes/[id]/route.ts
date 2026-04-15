// app/api/admin/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ message: `Admin update quiz ${id} endpoint in development` })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ message: `Admin delete quiz ${id} endpoint in development` })
}