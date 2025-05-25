import { API_URL, HEADERS } from '@/data/constants';
import { contactCreate } from './contact';

const baseRequestUrl = `${API_URL}/email`;

export const emailSend = async (options: {
  from: { name: string; email: string };
  phone: string;
  message: string;
}) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(options),
    });

    const response = await fetch(request);

    await contactCreate(options.from, { notify: false }); // add contact to audience

    return response;
  } catch (error) {
    console.error('---> handler error - (send email):', error);
    throw error;
  }
};
