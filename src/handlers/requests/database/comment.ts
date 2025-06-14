import { API_URL, HEADERS } from '@/data/constants';
import { CommentUpdate } from '@/types/models/comment';
import { CommentCreate } from '@/types/models/custom';

const baseRequestUrl = `${API_URL}/comments`;

export const commentsGet = async (slug: { postId?: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/post/${slug.postId}`, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get comments):', error);
    throw error;
  }
};

export const commentCreate = async (comment: CommentCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(comment),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create comment):', error);
    throw error;
  }
};

export const commentUpdate = async (comment: CommentUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${comment.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(comment),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update comment):', error);
    throw error;
  }
};

export const commentDelete = async (commentId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete comment):', error);
    throw error;
  }
};
