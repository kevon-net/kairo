import { Request as EnumRequest } from '@repo/enums';
import { apiUrl, headers } from '@/data/constants';
import { ReplyUpdate } from '@repo/types/models';
import { authHeaders } from '@/libraries/auth';
import { ReplyReplyCreate } from '@/types/bodies/request';

const baseRequestUrl = `${apiUrl}/replies/reply`;

export const repliesReplyGet = async (slug: { replyId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.replyId}`, {
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

export const replyReplyCreate = async (requestBody: ReplyReplyCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.replyId}`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create reply reply):', error);
    throw error;
  }
};

export const replyReplyUpdate = async (
  requestBody: Omit<ReplyUpdate, 'id'> & { id: string }
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.id}`, {
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update reply reply):', error);
    throw error;
  }
};

export const replyReplyDelete = async (slug: { replyId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.replyId}`, {
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
