import { apiUrl, headers } from '@/data/constants';
import { Credentials } from '@/types/auth';
import { Request as EnumRequest } from '@/types/enums';
import { Provider } from '@prisma/client';

export const signIn = async (options: {
  provider?: Provider;
  credentials?: Credentials;
}) => {
  try {
    const request = new Request(`${apiUrl}/auth/sign-in`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: headers.withBody,
      body: JSON.stringify({
        provider: options.provider || Provider.CREDENTIALS,
        credentials: options.credentials,
      }),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (sign in):', error);
    throw error;
  }
};
