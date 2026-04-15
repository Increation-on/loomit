// app/api/admin/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `Admin update quiz ${params.id} endpoint in development` })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `Admin delete quiz ${params.id} endpoint in development` })
}