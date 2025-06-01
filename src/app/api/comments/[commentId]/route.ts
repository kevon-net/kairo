import prisma from '@/libraries/prisma';
import { CommentCreate } from '@/types/models/custom';
import { CommentUpdate } from '@/types/models/comment';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function POST(request: NextRequest) {
  try {
    const comment: CommentCreate = await request.json();

    const commentRecord = await prisma.comment.findUnique({
      where: {
        name_content_post_id_profile_id: {
          name: comment.name || '',
          content: comment.content,
          post_id: comment.postId,
          profile_id: comment.profile_id || '',
        },
      },
    });

    if (commentRecord) {
      return NextResponse.json(
        { error: 'Comment already exists' },
        { status: 409, statusText: 'Already Exists' }
      );
    }

    const createComment = await prisma.comment.create({
      data: {
        name: comment.name,
        content: comment.content,
        post_id: comment.postId,
      },
    });

    return NextResponse.json(
      { message: 'Comment created successfully', comment: createComment },
      { status: 200, statusText: 'Comment Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create comment):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const commentRecord = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!commentRecord) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    const comment: CommentUpdate = await request.json();

    await prisma.comment.update({
      where: { id: commentId },
      data: comment,
    });

    return NextResponse.json(
      { message: 'Your comment has been updated' },
      { status: 200, statusText: 'Comment Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update comment):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
