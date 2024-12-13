import { API_URL, HEADERS } from '@/data/constants';
import { SignIn } from '@/types/bodies/request';
import { Request as EnumRequest } from '@repo/enums';

export const signIn = async (requestBody: SignIn) => {
  try {
    const request = new Request(`${API_URL}/auth/sign-in`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (sign in):', error);
    throw error;
  }
};
