import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const postRecords = await prisma.post.findMany({
      include: {
        _count: { select: { comments: true } },

        category: true,
        tags: true,
        profile: true,
      },

      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { posts: postRecords },
      { status: 200, statusText: 'Posts Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get posts):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
