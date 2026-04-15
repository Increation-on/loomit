// app/api/admin/questions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `Admin delete question ${params.id} endpoint in development` })
}