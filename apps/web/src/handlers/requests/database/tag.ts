import { Request as EnumRequest } from '@repo/enums';
import { API_URL, HEADERS } from '@/data/constants';

const baseRequestUrl = `${API_URL}/tags`;

export const tagsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get tags):', error);
    throw error;
  }
};

export const tagGet = async (slug: { tagId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.tagId}`, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get tag):', error);
    throw error;
  }
};
