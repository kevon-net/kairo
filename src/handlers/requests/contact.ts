import { API_URL } from '@/data/constants';
import { FormInquiryValues } from '@/hooks/form/inquiry';

export const contactAdd = async (params: Partial<FormInquiryValues>) => {
  try {
    const response = await fetch(`${API_URL}/email-contacts`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Add this if you need to send cookies
    });

    return response;
  } catch (error) {
    console.error('---> handler error (add email contact):', error);
    throw error;
  }
};
