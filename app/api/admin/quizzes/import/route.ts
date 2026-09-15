// app/api/admin/quizzes/import/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { quizImportSchema } from '@/lib/validators/quizImport';
import { levenshtein, normalizeCategoryName } from '@/lib/utils';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    const validated = quizImportSchema.safeParse(body);
    if (!validated.success) {
        return NextResponse.json(
            { error: validated.error.issues.map((i) => i.message).join(', ') },
            { status: 400 }
        );
    }

    const {
        title,
        description,
        categoryName,
        level,
        questions,
        forceCategoryId,
        forceCreateCategory,
    } = validated.data;

    let categoryId: string;

    // Приоритет 1: фронт уже выбрал существующую категорию
    if (forceCategoryId) {
        const exists = await prisma.category.findUnique({
            where: { id: forceCategoryId },
        });
        if (!exists) {
            return NextResponse.json(
                { error: 'Выбранная категория не найдена' },
                { status: 404 }
            );
        }
        categoryId = forceCategoryId;
    }
    // Приоритет 2: фронт решил создать новую принудительно
    else if (forceCreateCategory) {
        const newCategory = await prisma.category.create({
            data: { name: categoryName.trim(), iconUrl: null },
        });
        categoryId = newCategory.id;
    }

    // Приоритет 3: стандартная логика поиска/создания
    else {
        const allCategories = await prisma.category.findMany();
        const normalizedInput = normalizeCategoryName(categoryName);

        const existingCategory = allCategories.find(
            (cat) => normalizeCategoryName(cat.name) === normalizedInput
        );

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            // Ищем похожие: опечатки (Levenshtein ≤ 3) + префиксные совпадения
            const similar = allCategories
                .map((cat) => {
                    const normalizedCat = normalizeCategoryName(cat.name);
                    return {
                        id: cat.id,
                        name: cat.name,
                        distance: levenshtein(normalizedInput, normalizedCat),
                        isPrefix:
                            normalizedInput.startsWith(normalizedCat) ||
                            normalizedCat.startsWith(normalizedInput),
                    };
                })
                .filter((cat) => {
                    // Опечатки (расстояние 1–3)
                    if (cat.distance > 0 && cat.distance <= 3) return true;
                    // Префиксное совпадение (одна строка начинается с другой)
                    if (cat.isPrefix && cat.distance > 0) return true;
                    return false;
                })
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 5);

            // ✅ ВСЕГДА возвращаем конфликт, даже если похожих нет
            return NextResponse.json(
                {
                    code: 'CATEGORY_CONFLICT',
                    categoryName,
                    similarCategories: similar.map((c) => ({ id: c.id, name: c.name })),
                },
                { status: 409 }
            );
        }
    }

    // Создаём квиз
    const quiz = await prisma.quiz.create({
        data: {
            id: crypto.randomUUID(),
            title,
            description: description || '',
            category_id: categoryId,
            level,
            updated_at: new Date(),
            questions: {
                create: questions.map((q, index) => ({
                    id: crypto.randomUUID(),
                    text: q.text,
                    options: q.options,
                    correct_option_id: q.correctOptionId,
                    explanation: q.explanation,
                    order: index,
                })),
            },
        },
        include: { questions: true },
    });

    return NextResponse.json({ success: true, quiz }, { status: 201 });
}