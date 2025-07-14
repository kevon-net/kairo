import { API_URL, HEADERS } from '@/data/constants';
import {
  NotificationCreate,
  NotificationGet,
} from '@/types/models/notification';
import { linkify } from '@/utilities/formatters/string';

const baseRequestUrl = `${API_URL}/subscriptions/notifications`;

export const notificationsGet = async () => {
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
    console.error('---> handler error - (get notifications):', error);
    throw error;
  }
};

export const notificationsUpdate = async (
  notifications: NotificationGet[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ notifications, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update notifications):', error);
    throw error;
  }
};

export const notificationGet = async (slug: { endpointId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.endpointId}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get notification):', error);
    throw error;
  }
};

export const notificationCreate = async (
  params: Omit<NotificationCreate, 'profile'> & { profile_id: string }
) => {
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
    console.error('---> handler error - (create notification):', error);
    throw error;
  }
};

export const notificationUpdate = async (params: NotificationGet) => {
  try {
    const request = new Request(
      `${baseRequestUrl}/${linkify(params.endpoint)}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: HEADERS.WITH_BODY,
        body: JSON.stringify(params),
      }
    );

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update notification):', error);
    throw error;
  }
};

export const notificationDelete = async (slug: { endpointId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.endpointId}`, {
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
    console.error('---> handler error - (delete notification rule):', error);
    throw error;
  }
};
