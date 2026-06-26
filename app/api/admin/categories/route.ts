import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { name } = await req.json();

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return new NextResponse('Invalid category name', { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name: name.trim() },
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse('Failed to create category', { status: 500 });
    }
}

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

        await prisma.category.delete({
            where: { id },
        });

        return new NextResponse('Category deleted', { status: 200 });
    } catch (error) {
        return new NextResponse('Failed to delete category', { status: 500 });
    }
}