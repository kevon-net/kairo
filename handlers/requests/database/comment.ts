import { Request as EnumRequest } from '@/types/enums';
import { apiUrl, headers } from '@/data/constants';
import { CommentCreate, CommentUpdate } from '@/types/models/comment';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/comments`;

export const commentsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get comments):', error);
    throw error;
  }
};

export const commentCreate = async (
  comment: Omit<CommentCreate, 'id'> & { postId: string; userId?: string }
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
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
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
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
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete comment):', error);
    throw error;
  }
};
