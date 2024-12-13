import { Request as EnumRequest } from '@repo/enums';

export const getOauthToken = async (requestBody: { code: string }) => {
  try {
    const request = new Request(process.env.GOOGLE_TOKEN_URI || '', {
      method: EnumRequest.POST,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: requestBody.code,
        client_id: process.env.AUTH_GOOGLE_ID || '',
        client_secret: process.env.AUTH_GOOGLE_SECRET || '',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (get oauth token):', error);
    throw error;
  }
};
