import { API_URL, HEADERS } from '@/data/constants';
import { ReplyCreate, ReplyUpdate } from '@/types/models/reply';

const baseRequestUrl = `${API_URL}/replies/reply`;

export const repliesReplyGet = async (slug: { replyId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.replyId}`, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get reply replies):', error);
    throw error;
  }
};

export const replyReplyCreate = async (requestBody: ReplyCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.reply_id}`, {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
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
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
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
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete reply reply):', error);
    throw error;
  }
};
