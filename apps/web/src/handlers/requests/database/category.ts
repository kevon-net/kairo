import { Request as EnumRequest } from '@repo/enums';
import { API_URL, HEADERS } from '@/data/constants';

const baseRequestUrl = `${API_URL}/categories`;

export const categoriesGet = async () => {
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
    console.error('---> handler error - (get categories):', error);
    throw error;
  }
};

export const categoryGet = async (slug: { categoryId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.categoryId}`, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get category):', error);
    throw error;
  }
};
