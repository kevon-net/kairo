import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const postRecord = await prisma.post.findUnique({
      where: { id: postId },

      include: {
        comments: {
          include: {
            _count: { select: { replies: true } },

            profile: true,
          },

          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!postRecord) {
      return NextResponse.json(
        { error: "Post doesn't exist" },
        { status: 404, statusText: 'Not Found' }
      );
    }

    return NextResponse.json(
      { comments: postRecord.comments },
      { status: 200, statusText: 'Comments Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get post comments):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
