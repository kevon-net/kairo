import prisma from '@/libraries/prisma';
import { ReplyCommentCreate } from '@/types/models/custom';
import { ReplyUpdate } from '@/types/models/reply';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    let getResolvedCommentReplies;

    try {
      getResolvedCommentReplies = await prisma.$transaction(async () => {
        const commentRecord = await prisma.comment.findUnique({
          where: { id: commentId },
          include: {
            replies: {
              include: {
                profile: true,
              },

              orderBy: { created_at: 'desc' },
            },
          },
        });

        if (!commentRecord) {
          throw new Error('404');
        }

        // Collect IDs for comment replies
        const commentReplyIds = commentRecord.replies.flatMap(
          (reply) => reply.id
        );

        // Fetch all reply replies in a single query
        const replyReplies = await prisma.reply.findMany({
          where: { reply_id: { in: commentReplyIds } },
          select: { reply_id: true },
        });

        return {
          ...commentRecord,

          replies: commentRecord.replies.map((commentReply) => {
            return {
              ...commentReply,

              _count: {
                replies: replyReplies.filter(
                  (replyReply) => replyReply.reply_id == commentReply.id
                ).length,
              },
            };
          }),
        };
      });
    } catch (error) {
      if ((error as Error).message == '404') {
        return NextResponse.json(
          { error: "Comment doesn't exist" },
          { status: 404, statusText: 'Not Found' }
        );
      }

      throw new Error((error as Error).message);
    }

    return NextResponse.json(
      { replies: getResolvedCommentReplies.replies },
      { status: 200, statusText: 'Replies Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get replies):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const reply: Omit<ReplyCommentCreate, 'commentId'> = await request.json();

    const placeHolder = commentId;

    const replyRecord = await prisma.reply.findUnique({
      where: {
        name_content_reply_id_comment_id_profile_id: {
          name: reply.name || '',
          content: reply.content,
          reply_id: placeHolder,
          comment_id: commentId,
          profile_id: reply.profile_id || placeHolder,
        },
      },
    });

    if (replyRecord) {
      return NextResponse.json(
        { error: 'Reply already exists' },
        { status: 409, statusText: 'Already Exists' }
      );
    }

    const createReply = await prisma.reply.create({
      data: {
        name: reply.name,
        content: reply.content,
        comment_id: commentId,
        profile_id: reply.profile_id,
      },
    });

    return NextResponse.json(
      { message: 'Reply created successfully', reply: createReply },
      { status: 200, statusText: 'Reply Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create reply):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const reply: Omit<ReplyUpdate, 'id'> & { id: string } =
      await request.json();

    const replyRecord = await prisma.reply.findUnique({
      where: { id: reply.id },
    });

    if (!replyRecord) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    await prisma.reply.update({ where: { id: reply.id }, data: reply });

    return NextResponse.json(
      { message: 'Your reply has been updated' },
      { status: 200, statusText: 'Reply Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update reply):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
