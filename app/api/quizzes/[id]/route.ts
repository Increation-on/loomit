// app/api/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateQuizSchema } from '@/lib/validators'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Квиз не найден' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const validated = updateQuizSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      )
    }
    
    const quiz = await prisma.quiz.update({
      where: { id: params.id },
      data: validated.data
    })
    
    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.quiz.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}