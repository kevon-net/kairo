import { Variant } from '@repo/enums';
import { repliesReplyGet } from '@/handlers/requests/database/reply/reply';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateComments } from '@/libraries/redux/slices/comments';
import { ReplyRelations } from '@repo/types/models';
import { showNotification } from '@/utilities/notifications';
import { useState } from 'react';

export const useFetchRepliesReply = (params: { replyId: string }) => {
  const [loading, setLoading] = useState(false);

  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const fetchReplyReplies = async () => {
    try {
      setLoading(true);

      const { replies }: { replies: ReplyRelations[] } = await repliesReplyGet({
        replyId: params.replyId,
      });

      dispatch(
        updateComments(
          comments.map((comment) => {
            return {
              ...comment,

              replies: comment.replies?.map((commentReply) => {
                if (commentReply.id == params.replyId) {
                  return {
                    ...commentReply,

                    replies: !commentReply.replies
                      ? replies
                      : [...commentReply.replies, ...replies],
                  };
                }

                return commentReply;
              }),
            };
          })
        )
      );
    } catch (error) {
      showNotification({
        variant: Variant.FAILED,
        desc: (error as Error).message,
      });

      console.error('---> hook error - (fetch comment replies):', error);

      return;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetch: fetchReplyReplies,
    replies: comments.find((comment) =>
      comment.replies?.find((commentReply) => commentReply.id == params.replyId)
    )?.replies,
  };
};
