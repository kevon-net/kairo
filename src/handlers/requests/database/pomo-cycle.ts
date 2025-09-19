import { API_URL, HEADERS } from '@/data/constants';
import { PomoCycleUpdate } from '@/types/models/pomo-cycle';

const baseRequestUrl = `${API_URL}/pomo-cycles`;

export const pomoCyclesGet = async () => {
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
    console.error('---> handler error - (get pomo cycles):', error);
    throw error;
  }
};

export const pomoCyclesUpdate = async (
  pomoCycles: PomoCycleUpdate[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ pomoCycles, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update pomo cycles):', error);
    throw error;
  }
};

export const pomoCycleGet = async (slug: { pomoCycleId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.pomoCycleId}`, {
      method: 'GET',
      credentials: 'include',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get pomo cycle):', error);
    throw error;
  }
};
