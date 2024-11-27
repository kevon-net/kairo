import { apiUrl } from '@/data/constants';
import { EmailInquiry } from '@/types/email';
import { Request as EnumRequest } from '@/types/enums';

const baseRequestUrl = `${apiUrl}/email/contact`;

export const contactCreate = async (options: EmailInquiry['from']) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.POST,
      body: JSON.stringify(options),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create contact):', error);
    throw error;
  }
};
