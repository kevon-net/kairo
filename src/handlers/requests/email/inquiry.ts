import { API_URL, HEADERS } from '@/data/constants';
import { FormInquiryValues } from '@/hooks/form/inquiry';

const baseRequestUrl = `${API_URL}/inquiry`;

export const handleInquiry = async (formData: FormInquiryValues) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(formData),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (send inquiry):', error);
    throw error;
  }
};
