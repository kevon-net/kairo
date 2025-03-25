import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postRecord = await prisma.post.findUnique({
      where: { id: params.postId },

      include: {
        _count: { select: { comments: true } },

        category: true,
        tags: true,
        profile: true,
      },
    });

    return NextResponse.json(
      { post: postRecord },
      { status: 200, statusText: 'Post Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get post):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
