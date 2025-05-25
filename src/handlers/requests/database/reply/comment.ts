import { API_URL, HEADERS } from '@/data/constants';
import { ReplyUpdate } from '@/types/models/reply';
import { ReplyCommentCreate } from '@/types/models/custom';

const baseRequestUrl = `${API_URL}/replies/comment`;

export const repliesCommentGet = async (slug: { commentId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.commentId}`, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get comment replies):', error);
    throw error;
  }
};

export const replyCommentCreate = async (requestBody: ReplyCommentCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.comment_id}`, {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create comment reply):', error);
    throw error;
  }
};

export const replyCommentUpdate = async (
  requestBody: Omit<ReplyUpdate, 'id'> & { id: string }
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update comment reply):', error);
    throw error;
  }
};

export const replyCommentDelete = async (slug: { replyId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.replyId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete comment reply):', error);
    throw error;
  }
};
