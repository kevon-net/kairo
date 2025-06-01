import { Variant } from '@/enums/notification';
import { repliesCommentGet } from '@/handlers/requests/database/reply/comment';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateComments } from '@/libraries/redux/slices/comments';
import { ReplyRelations } from '@/types/models/reply';
import { showNotification } from '@/utilities/notifications';
import { useState } from 'react';

export const useFetchRepliesComment = (params: { commentId: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReplyRelations[]>([]);

  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const fetchCommentReplies = async () => {
    try {
      setLoading(true);

      const { replies }: { replies: ReplyRelations[] } =
        await repliesCommentGet({
          commentId: params.commentId,
        });

      setData(replies);

      dispatch(
        updateComments(
          comments.map((comment) => {
            if (comment.id == params.commentId) {
              return { ...comment, replies: replies };
            }

            return comment;
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
    fetch: fetchCommentReplies,
    comments,
  };
};
