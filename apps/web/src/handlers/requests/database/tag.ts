import { Request as EnumRequest } from '@repo/enums';
import { apiUrl, headers } from '@/data/constants';

const baseRequestUrl = `${apiUrl}/tags`;

export const tagsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: headers.withoutBody,
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
      headers: headers.withoutBody,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get tag):', error);
    throw error;
  }
};
