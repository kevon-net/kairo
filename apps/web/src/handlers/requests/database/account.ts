import { Request as EnumRequest } from '@repo/enums';
import { API_URL, HEADERS } from '@/data/constants';
import { AccountCreate, AccountUpdate } from '@repo/types/models';
import { authHeaders } from '@/libraries/auth';

const baseRequestUrl = `${API_URL}/accounts`;

export const accountCreate = async (account: AccountCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(HEADERS.WITH_BODY),
      body: JSON.stringify(account),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create account):', error);
    throw error;
  }
};

export const accountUpdate = async (account: AccountUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${account.id}`, {
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(HEADERS.WITH_BODY),
      body: JSON.stringify(account),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update account):', error);
    throw error;
  }
};

export const accountDelete = async (accountId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${accountId}`, {
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(HEADERS.WITHOUT_BODY),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete account):', error);
    throw error;
  }
};
