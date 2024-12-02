import { Request as EnumRequest } from '@/enums/request';
import { apiUrl, headers } from '@/data/constants';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/posts/tags`;

export const tagsGet = async () => {
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
    console.error('---> handler error - (get tags):', error);
    throw error;
  }
};
