import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryRecord = await prisma.category.findUnique({
      where: { id: params.categoryId },

      include: {
        _count: { select: { posts: true } },

        posts: {
          select: {
            id: true,
            image: true,
            title: true,
            excerpt: true,
            createdAt: true,
            viewCount: true,

            _count: { select: { comments: true } },

            category: { select: { id: true, title: true } },

            tags: { select: { id: true, title: true } },

            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },

          orderBy: { createdAt: 'desc' },
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
