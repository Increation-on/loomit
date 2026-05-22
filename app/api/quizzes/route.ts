// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createQuizSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const validated = createQuizSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      )
    }
    
    const quiz = await prisma.quiz.create({
      data: {
        ...validated.data,
        updated_at: new Date(),
      },
    })
    
    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('POST /api/quizzes error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('GET /api/quizzes error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}