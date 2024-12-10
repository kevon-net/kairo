import { apiUrl, headers } from '@/data/constants';
import { SignIn } from '@/types/bodies/request';
import { Request as EnumRequest } from '@repo/enums';
import { Provider } from '@prisma/client';

export const signIn = async (
  requestBody: SignIn = { provider: Provider.CREDENTIALS }
) => {
  try {
    const request = new Request(`${apiUrl}/auth/sign-in`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: headers.withBody,
      body: JSON.stringify(requestBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (sign in):', error);
    throw error;
  }
};
