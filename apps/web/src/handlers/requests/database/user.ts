import { apiUrl, headers } from '@/data/constants';
import { Request as EnumRequest } from '@/enums/request';
import { UserCreate } from '@/types/models/user';
import { authHeaders } from '@/utilities/helpers/auth';
import { UserDelete, UserUpdate } from '@/types/bodies/request';

const baseRequestUrl = `${apiUrl}/users`;

export const userCreate = async (user: UserCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(user),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create user):', error);
    throw error;
  }
};

export const userUpdate = async (requestBody: UserUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.user.id}`, {
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update user):', error);
    throw error;
  }
};

export const userDelete = async (requestBody: UserDelete) => {
  try {
    const request = new Request(`${baseRequestUrl}/${requestBody.userId}`, {
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (remove user):', error);
    throw error;
  }
};
