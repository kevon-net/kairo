import { API_URL, HEADERS } from '@/data/constants';
import { ViewCreate, ViewGet } from '@/types/models/views';

const baseRequestUrl = `${API_URL}/views`;

export const viewsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get views):', error);
    throw error;
  }
};

export const viewsUpdate = async (views: ViewGet[], deletedIds?: string[]) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ views, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update views):', error);
    throw error;
  }
};

export const viewGet = async (slug: { viewId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.viewId}`, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get view):', error);
    throw error;
  }
};

export const viewCreate = async (params: ViewCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/new`, {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(params),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (create view):', error);
    throw error;
  }
};

export const viewUpdate = async (params: ViewGet) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(params),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update view):', error);
    throw error;
  }
};

export const viewDelete = async (slug: { viewId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.viewId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (delete view rule):', error);
    throw error;
  }
};
