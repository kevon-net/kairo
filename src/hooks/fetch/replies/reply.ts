import { Variant } from '@/enums/notification';
import { repliesReplyGet } from '@/handlers/requests/database/reply/reply';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateComments } from '@/libraries/redux/slices/comments';
import { ReplyRelations } from '@/types/models/reply';
import { showNotification } from '@/utilities/notifications';
import { useState } from 'react';

export const useFetchRepliesReply = (params: { replyId: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReplyRelations[]>([]);

  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const fetchReplyReplies = async () => {
    try {
      setLoading(true);

      const { replies }: { replies: ReplyRelations[] } = await repliesReplyGet({
        replyId: params.replyId,
      });

      setData(replies);

      dispatch(
        updateComments(
          comments.map((comment) => {
            return {
              ...comment,

              replies: comment.replies?.map((commentReply) => {
                if (commentReply.id == params.replyId) {
                  return { ...commentReply, replies: replies };
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
    data,
    fetch: fetchReplyReplies,
    replies: comments.find((comment) =>
      comment.replies?.find((commentReply) => commentReply.id == params.replyId)
    )?.replies,
  };
};
