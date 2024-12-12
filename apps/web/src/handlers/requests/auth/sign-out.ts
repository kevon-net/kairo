import { API_URL, HEADERS } from '@/data/constants';
import { Request as EnumRequest } from '@repo/enums';
import { authHeaders } from '@/libraries/auth';

export const signOut = async () => {
  try {
    const request = new Request(`${API_URL}/auth/sign-out`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(HEADERS.WITHOUT_BODY),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (sign out):', error);
    throw error;
  }
};
