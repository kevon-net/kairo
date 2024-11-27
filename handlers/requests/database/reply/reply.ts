import { Request as EnumRequest } from '@/types/enums';
import { apiUrl, headers } from '@/data/constants';
import { ReplyReplyCreate, ReplyReplyUpdate } from '@/types/models/reply';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/replies/reply`;

export const repliesReplyGet = async () => {
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
    console.error('---> handler error - (get reply replies):', error);
    throw error;
  }
};

export const replyReplyCreate = async (
  reply: Omit<ReplyReplyCreate, 'id' | 'replyComment'> & {
    replyCommentId: string;
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
    console.error('---> handler error - (create reply reply):', error);
    throw error;
  }
};

export const replyReplyUpdate = async (reply: ReplyReplyUpdate) => {
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
    console.error('---> handler error - (update reply reply):', error);
    throw error;
  }
};

export const replyReplyDelete = async (replyId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${replyId}`, {
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete reply reply):', error);
    throw error;
  }
};
