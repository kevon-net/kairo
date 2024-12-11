import { apiUrl, headers } from '@/data/constants';
import { Request as EnumRequest } from '@repo/enums';

export const passwordForgot = async (requestBody: { email: string }) => {
  try {
    const request = new Request(`${apiUrl}/auth/password/forgot`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: headers.withBody,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (password forgot):', error);
    throw error;
  }
};
