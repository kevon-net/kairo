import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const tagRecord = await prisma.tag.findUnique({
      where: { id: params.tagId },

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

            user: {
              select: {
                id: true,
                profile: {
                  select: { name: true, avatar: true },
                },
              },
            },
          },

          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(
      { tag: tagRecord },
      { status: 200, statusText: 'Tag Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tag):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
