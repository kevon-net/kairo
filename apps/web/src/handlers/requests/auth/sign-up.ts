import { apiUrl, headers } from '@/data/constants';
import { SignUp } from '@/types/bodies/request';
import { Request as EnumRequest } from '@repo/enums';

export const signUp = async (params: SignUp) => {
  try {
    const request = new Request(`${apiUrl}/auth/sign-up`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: headers.withBody,
      body: JSON.stringify(params),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (sign up):', error);
    throw error;
  }
};
