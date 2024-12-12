import { API_URL } from '@/data/constants';
import { EmailContactCreate } from '@/types/email';
import { Request as EnumRequest } from '@repo/enums';

const baseRequestUrl = `${API_URL}/email/contact`;

export const contactCreate = async (contactOptions: EmailContactCreate) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.POST,
      body: JSON.stringify(contactOptions),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create contact):', error);
    throw error;
  }
};
