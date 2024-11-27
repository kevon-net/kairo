import { apiUrl, headers } from '@/data/constants';
import { Request as EnumRequest } from '@/types/enums';

export const passwordForgot = async (email: string) => {
  try {
    const request = new Request(`${apiUrl}/auth/password/forgot`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: headers.withBody,
      body: JSON.stringify(email),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (password forgot):', error);
    throw error;
  }
};
