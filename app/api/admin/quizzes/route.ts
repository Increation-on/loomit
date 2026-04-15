// app/api/admin/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Admin quizzes list endpoint in development' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Admin create quiz endpoint in development' })
}