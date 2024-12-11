import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const postRecords = await prisma.post.findMany({
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
