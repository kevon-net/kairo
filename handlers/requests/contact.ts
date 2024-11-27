import { apiUrl } from '@/data/constants';
import { EmailInquiry } from '@/types/email';
import { Request as EnumRequest } from '@/types/enums';

export const sendInquiry = async (params: EmailInquiry) => {
  try {
    const request = new Request(`${apiUrl}/email/contact`, {
      method: EnumRequest.POST,
      body: JSON.stringify(params),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (send inquiry):', error);
    throw error;
  }
};
