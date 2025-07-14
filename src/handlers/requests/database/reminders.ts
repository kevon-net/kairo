import { API_URL, HEADERS } from '@/data/constants';
import { ReminderCreate, ReminderGet } from '@/types/models/reminder';

const baseRequestUrl = `${API_URL}/reminders`;

export const remindersGet = async () => {
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
    console.error('---> handler error - (get reminders):', error);
    throw error;
  }
};

export const remindersUpdate = async (
  reminders: ReminderGet[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ reminders, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update reminders):', error);
    throw error;
  }
};

export const reminderGet = async (slug: { reminderId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.reminderId}`, {
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
    console.error('---> handler error - (get reminder):', error);
    throw error;
  }
};

export const reminderCreate = async (params: ReminderCreate) => {
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
    console.error('---> handler error - (create reminder):', error);
    throw error;
  }
};

export const reminderUpdate = async (params: ReminderGet) => {
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
    console.error('---> handler error - (update reminder):', error);
    throw error;
  }
};

export const reminderDelete = async (slug: { reminderId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.reminderId}`, {
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
    console.error('---> handler error - (delete reminder rule):', error);
    throw error;
  }
};
