import { Request as EnumRequest } from '@/types/enums';
import { apiUrl, headers } from '@/data/constants';
import { AccountCreate, AccountUpdate } from '@/types/models/account';
import { authHeaders } from '@/utilities/helpers/auth';

const baseRequestUrl = `${apiUrl}/accounts`;

export const accountCreate = async (account: AccountCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
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
      headers: await authHeaders(headers.withBody),
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
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete account):', error);
    throw error;
  }
};
