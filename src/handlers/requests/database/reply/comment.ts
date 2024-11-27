import { Request as EnumRequest } from '@/types/enums';
import { apiUrl, headers } from '@/data/constants';
import { ReplyCommentCreate, ReplyCommentUpdate } from '@/types/models/reply';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/replies/comment`;

export const repliesCommentGet = async () => {
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
    console.error('---> handler error - (get comment replies):', error);
    throw error;
  }
};

export const replyCommentCreate = async (
  reply: Omit<ReplyCommentCreate, 'id' | 'comment'> & {
    commentId: string;
    userId?: string;
  }
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(reply),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create comment reply):', error);
    throw error;
  }
};

export const replyCommentUpdate = async (reply: ReplyCommentUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${reply.id}`, {
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(reply),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update comment reply):', error);
    throw error;
  }
};

export const replyCommentDelete = async (replyId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${replyId}`, {
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete comment reply):', error);
    throw error;
  }
};
