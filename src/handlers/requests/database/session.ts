import { API_URL, HEADERS } from '@/data/constants';
import {
  SessionCreate,
  SessionRelations,
  SessionUpdate,
} from '@/types/models/session';

const baseRequestUrl = `${API_URL}/sessions`;

export const sessionsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
      cache: 'no-store',
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get sessions):', error);
    throw error;
  }
};

export const sessionsUpdate = async (
  sessions: SessionRelations[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ sessions, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update sessions):', error);
    throw error;
  }
};

export const sessionGet = async (slug: { sessionId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.sessionId}`, {
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
    console.error('---> handler error - (get session):', error);
    throw error;
  }
};

export const sessionCreate = async (params: SessionCreate) => {
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
    console.error('---> handler error - (create session):', error);
    throw error;
  }
};

export const sessionUpdate = async (params: SessionUpdate) => {
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
    console.error('---> handler error - (update session):', error);
    throw error;
  }
};

export const sessionDelete = async (slug: { sessionId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.sessionId}`, {
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
    console.error('---> handler error - (delete session):', error);
    throw error;
  }
};
