import { Variant } from '@/enums/notification';
import { commentsGet } from '@/handlers/requests/database/comment';
import { updateComments } from '@/libraries/redux/slices/comments';
import { showNotification } from '@/utilities/notifications';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';

export const useFetchComments = (params: { postId: string }) => {
  const [loading, setLoading] = useState(false);

  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const fetchComments = async () => {
    try {
      setLoading(true);

      const result = await commentsGet({ postId: params.postId });

      dispatch(updateComments(result.comments));
    } catch (error) {
      showNotification({
        variant: Variant.FAILED,
        desc: (error as Error).message,
      });

      console.error('---> hook error - (fetch comments):', error);

      return;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetch: fetchComments,
    comments,
  };
};
