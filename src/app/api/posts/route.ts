import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const postRecords = await prisma.post.findMany({
      include: {
        _count: { select: { comments: true } },

        category: true,
        tags: true,
        profile: true,
      },

      orderBy: { created_at: 'desc' },
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
