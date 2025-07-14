import { API_URL, HEADERS } from '@/data/constants';
import { TaskCreate, TaskRelations, TaskUpdate } from '@/types/models/task';

const baseRequestUrl = `${API_URL}/tasks`;

export const tasksGet = async () => {
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
    console.error('---> handler error - (get tasks):', error);
    throw error;
  }
};

export const tasksUpdate = async (
  tasks: TaskRelations[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ tasks, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update tasks):', error);
    throw error;
  }
};

export const taskGet = async (slug: { taskId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.taskId}`, {
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
    console.error('---> handler error - (get task):', error);
    throw error;
  }
};

export const taskCreate = async (params: TaskCreate) => {
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
    console.error('---> handler error - (create task):', error);
    throw error;
  }
};

export const taskUpdate = async (params: TaskUpdate) => {
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
    console.error('---> handler error - (update task):', error);
    throw error;
  }
};

export const taskDelete = async (slug: { taskId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.taskId}`, {
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
    console.error('---> handler error - (delete task):', error);
    throw error;
  }
};
