import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const categoryRecord = await prisma.category.findUnique({
      where: { id: categoryId },

      include: {
        _count: { select: { posts: true } },

        posts: {
          include: {
            _count: { select: { comments: true } },

            category: true,
            tags: true,
            profile: true,
          },

          orderBy: { created_at: 'desc' },
        },
      },
    });

    return NextResponse.json(
      { category: categoryRecord },
      { status: 200, statusText: 'Category Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
