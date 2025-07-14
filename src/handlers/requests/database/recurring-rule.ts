import { API_URL, HEADERS } from '@/data/constants';
import {
  RecurringRuleCreate,
  RecurringRuleUpdate,
} from '@/types/models/recurring-rule';

const baseRequestUrl = `${API_URL}/recurring-rules`;

export const recurringRulesGet = async () => {
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
    console.error('---> handler error - (get recurring rules):', error);
    throw error;
  }
};

export const recurringRulesUpdate = async (
  recurringRules: RecurringRuleUpdate[],
  deletedIds?: string[]
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ recurringRules, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update recurring rules):', error);
    throw error;
  }
};

export const recurringRuleGet = async (slug: { recurringRuleId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.recurringRuleId}`, {
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
    console.error('---> handler error - (get recurring rule):', error);
    throw error;
  }
};

export const recurringRuleCreate = async (params: RecurringRuleCreate) => {
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
    console.error('---> handler error - (create recurring rule):', error);
    throw error;
  }
};

export const recurringRuleUpdate = async (params: RecurringRuleUpdate) => {
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
    console.error('---> handler error - (update recurring rule):', error);
    throw error;
  }
};

export const recurringRuleDelete = async (slug: {
  recurringRuleId: string;
}) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.recurringRuleId}`, {
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
    console.error('---> handler error - (delete recurring rule):', error);
    throw error;
  }
};
