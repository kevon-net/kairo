import { API_URL, HEADERS } from '@/data/constants';
import { EmailContact } from '@/types/email';

const baseRequestUrl = `${API_URL}/email/contact`;

export const contactCreate = async (
  contact: EmailContact,
  options?: { notify?: boolean }
) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ contact, options }),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create contact):', error);
    throw error;
  }
};
