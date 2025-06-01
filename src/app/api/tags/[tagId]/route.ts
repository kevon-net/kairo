import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;

    const tagRecord = await prisma.tag.findUnique({
      where: { id: tagId },

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
