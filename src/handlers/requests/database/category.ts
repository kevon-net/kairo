import { API_URL, HEADERS } from '@/data/constants';
import { CategoryUpdate } from '@/types/models/category';

const baseRequestUrl = `${API_URL}/categories`;

export const categoriesGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
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

export const categoriesUpdate = async (
  categories: CategoryUpdate[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ categories, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update categories):', error);
    throw error;
  }
};

export const categoryGet = async (slug: { categoryId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.categoryId}`, {
      method: 'GET',
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
