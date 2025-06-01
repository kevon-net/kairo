import prisma from '@/libraries/prisma';
import { ReplyReplyCreate } from '@/types/models/custom';
import { ReplyUpdate } from '@/types/models/reply';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const { replyId } = await params;

    let getResolvedReplyReplies;

    try {
      getResolvedReplyReplies = await prisma.$transaction(async () => {
        const replyRecord = await prisma.reply.findUnique({
          where: { id: replyId },
          select: { id: true },
        });

        if (!replyRecord) {
          throw new Error('404');
        }

        const replyRecords = await prisma.reply.findMany({
          where: { reply_id: replyId },

          include: {
            profile: true,
          },

          orderBy: { created_at: 'desc' },
        });

        return replyRecords;
      });
    } catch (error) {
      if ((error as Error).message == '404') {
        return NextResponse.json(
          { error: "Reply doesn't exist" },
          { status: 404, statusText: 'Not Found' }
        );
      }

      throw new Error((error as Error).message);
    }

    return NextResponse.json(
      { replies: getResolvedReplyReplies },
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
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const { replyId } = await params;

    const reply: Omit<ReplyReplyCreate, 'replyId'> = await request.json();

    const placeHolder = replyId;

    const replyRecord = await prisma.reply.findUnique({
      where: {
        name_content_reply_id_comment_id_profile_id: {
          name: reply.name || '',
          content: reply.content,
          reply_id: replyId,
          comment_id: placeHolder,
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
        reply_id: replyId,
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
