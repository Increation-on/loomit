// src/app/api/attempts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { shuffle } from '@/lib/utils';

export const runtime = 'nodejs';

// 🔹 НОВЫЙ ЭНДПОЙНТ: создание попытки + первый ответ
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { quizId, questionId, selectedOptionId, isCorrect, questionText, correctOptionId } = body;

    if (!quizId || !questionId || !selectedOptionId) {
      return NextResponse.json(
        { error: 'Не хватает данных для создания попытки' },
        { status: 400 }
      );
    }

    // 1. Получаем все вопросы квиза
    const questions = await prisma.question.findMany({
      where: { quiz_id: quizId },
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: 'Вопросы для квиза не найдены' }, { status: 404 });
    }

    // 2. Шафлим вопросы
    const shuffledQuestions = shuffle([...questions]);
    const shuffledIds = shuffledQuestions.map((q) => q.id);

    // 3. Шафлим варианты для каждого вопроса
    const questionsWithShuffledOptions = shuffledQuestions.map((q) => {
      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
      const normalizedOptions = optionsArray.map((opt: unknown, idx: number) =>
        typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
      );
      const shuffledOptions = shuffle([...normalizedOptions]);
      return {
        ...q,
        options: shuffledOptions,
        correctOptionId: q.correct_option_id || '',
      };
    });

    // 4. Создаём попытку
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
        question_order: shuffledIds,
        status: 'IN_PROGRESS',
        sync_status: 'synced',
      },
    });

    // 5. Возвращаем созданную попытку и зашафленные вопросы
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
        questions: questionsWithShuffledOptions,
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