import { Request as EnumRequest } from '@/enums/request';
import { apiUrl, headers } from '@/data/constants';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/categories`;

export const categoriesGet = async () => {
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
    console.error('---> handler error - (get categories):', error);
    throw error;
  }
};

export const categoryGet = async (slug: { categoryId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.categoryId}`, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get category):', error);
    throw error;
  }
};
