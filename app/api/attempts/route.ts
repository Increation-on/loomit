// src/app/api/attempts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      quizId,
      questionId,
      selectedOptionId,
      isCorrect,
      questionText,
      correctOptionId,
      questionOrder, // ← принимаем порядок от клиента
    } = body;

    if (!quizId || !questionId || !selectedOptionId) {
      return NextResponse.json(
        { error: 'Не хватает данных для создания попытки' },
        { status: 400 }
      );
    }

    // Закрываем все старые IN_PROGRESS попытки
    if (session?.user?.id) {
      await prisma.attempt.updateMany({
        where: {
          user_id: session.user.id,
          status: 'IN_PROGRESS',
        },
        data: { status: 'COMPLETED' },
      });
    }

    // 1. Получаем все вопросы квиза
    const questions = await prisma.question.findMany({
      where: { quiz_id: quizId },
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: 'Вопросы для квиза не найдены' }, { status: 404 });
    }

    // 2. Строим карту вопросов по ID
    const questionsMap = Object.fromEntries(questions.map((q) => [q.id, q]));

    // 3. Определяем порядок вопросов
    //    - Если передан questionOrder — используем его
    //    - Иначе — используем порядок из БД (как есть)
    const orderIds = questionOrder && Array.isArray(questionOrder) && questionOrder.length > 0
      ? questionOrder
      : questions.map((q) => q.id);

    // 4. Получаем вопросы в нужном порядке
    const orderedQuestions = orderIds
      .map((id: string) => questionsMap[id])
      .filter(Boolean);

    // 5. Формируем вопросы с опциями (без шафла, только нормализация)
    const questionsWithOptions = orderedQuestions.map((q) => {
      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
      const normalizedOptions = optionsArray.map((opt: unknown, idx: number) =>
        typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
      );
      return {
        ...q,
        options: normalizedOptions,
        correctOptionId: q.correct_option_id || '',
      };
    });

    // 6. Создаём попытку
    const attempt = await prisma.attempt.create({
      data: {
        user_id: session?.user?.id || null,
        guest_id: session?.user?.id ? null : `guest_${Date.now()}`,
        quiz_id: quizId,
        score: isCorrect ? 1 : 0,
        total_questions: questions.length,
        answers: [
          {
            questionId,
            selectedOptionId,
            isCorrect,
            questionText,
            correctOptionId,
          },
        ],
        question_order: orderIds, // ← сохраняем переданный порядок
        status: 'IN_PROGRESS',
        sync_status: 'synced',
      },
    });

    // 7. Возвращаем созданную попытку и вопросы
    return NextResponse.json(
      {
        success: true,
        attempt: {
          id: attempt.id,
          quizId: attempt.quiz_id,
          title: '',
          answers: attempt.answers,
          currentIndex: 1,
          startedAt: attempt.created_at.toISOString(),
        },
        questions: questionsWithOptions,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Ошибка создания попытки с первым ответом:', error);
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 });
  }
}