import { API_URL, HEADERS } from '@/data/constants';
import { Request as EnumRequest } from '@repo/enums';

export const passwordForgot = async (requestBody: { email: string }) => {
  try {
    const request = new Request(`${API_URL}/auth/password/forgot`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (password forgot):', error);
    throw error;
  }
};
