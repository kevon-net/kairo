import prisma from '@/libraries/prisma';
import { ReplyReplyCreate } from '@/types/bodies/request';
import { ReplyUpdate } from '@/types/models/reply';
import { generateId } from '@/utilities/generators/id';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { replyId: string } }
) {
  try {
    const reply: Omit<ReplyReplyCreate, 'replyId'> = await request.json();

    const replyRecord = await prisma.reply.findUnique({
      where: {
        name_content_replyId_commentId_userId: {
          name: reply.name || '',
          content: reply.content,
          replyId: params.replyId,
          commentId: '',
          userId: reply.userId || '',
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
        id: generateId(),
        name: reply.name,
        content: reply.content,
        replyId: params.replyId,
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
