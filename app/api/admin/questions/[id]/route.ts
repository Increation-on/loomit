// app/api/admin/questions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ message: `Admin delete question ${id} endpoint in development` })
}