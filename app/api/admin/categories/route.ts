import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';


// ✅ GET — публичный (не требует авторизации)
export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            iconUrl: true,
            _count: {
                select: { quizzes: true },
            },
        },
    });

    return NextResponse.json(categories, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}

// ✅ POST — только для админа
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { name, iconUrl } = await req.json();

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return new NextResponse('Invalid category name', { status: 400 });
        }

        const existing = await prisma.category.findUnique({
            where: { name: name.trim() },
        });
        if (existing) {
            return new NextResponse('Category already exists', { status: 409 });
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                iconUrl: iconUrl || null,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse('Failed to create category', { status: 500 });
    }
}

// ✅ DELETE — только для админа
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse('Missing category id', { status: 400 });
        }

        // Проверяем, есть ли квизы у категории
        const quizCount = await prisma.quiz.count({
            where: { category_id: id },
        });

        if (quizCount > 0) {
            return NextResponse.json(
                { 
                    error: `Невозможно удалить категорию: ${quizCount} квиз(ов) используют её. Сначала удалите или переназначьте квизы.`,
                    code: 'QUIZZES_EXIST'
                },
                { status: 409 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Delete category error:', error);
        return NextResponse.json(
            { error: 'Ошибка при удалении категории' },
            { status: 500 }
        );
    }
}

// ✅ PUT — только для админа
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { id, name, iconUrl } = await req.json();

        if (!id || !name || typeof name !== 'string' || name.trim().length === 0) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: name.trim(),
                iconUrl: iconUrl || null,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse('Failed to update category', { status: 500 });
    }
}
