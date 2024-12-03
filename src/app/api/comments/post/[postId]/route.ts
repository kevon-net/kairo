import { Order } from '@/enums/sort';
import prisma from '@/libraries/prisma';
import { sortArray } from '@/utilities/helpers/array';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    let getResolvedPostComments;

    try {
      getResolvedPostComments = await prisma.$transaction(async () => {
        // Fetch the post with its immediate comments and replies
        const postRecord = await prisma.post.findUnique({
          where: { id: params.postId },
          include: { comments: { include: { replies: true, user: true } } },
        });

        if (!postRecord) {
          throw new Error('404');
        }

        // Collect IDs for nested comment replies
        const commentReplyIds = postRecord.comments.flatMap((comment) =>
          comment.replies.map((reply) => reply.id)
        );

        // Fetch all nested reply replies in a single query
        const replyReplies = await prisma.reply.findMany({
          where: { replyId: { in: commentReplyIds } },
        });

        // Construct the final structure
        const resolvedComments = sortArray(
          postRecord.comments,
          'createdAt',
          Order.DESCENDING
        ).map((comment) => ({
          ...comment,

          replies: sortArray(
            comment.replies,
            'createdAt',
            Order.DESCENDING
          ).map((reply) => ({
            ...reply,

            replies: sortArray(
              replyReplies,
              'createdAt',
              Order.DESCENDING
            ).filter((replyReply) => replyReply.replyId === reply.id),
          })),
        }));

        return resolvedComments;
      });
    } catch (error) {
      if ((error as Error).message == '404') {
        return NextResponse.json(
          { error: "Post doesn't exist" },
          { status: 404, statusText: 'Not Found' }
        );
      }

      throw new Error((error as Error).message);
    }

    return NextResponse.json(
      { comments: getResolvedPostComments },
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
