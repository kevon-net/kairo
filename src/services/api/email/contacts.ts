import { FormInquiryValues } from '@/hooks/form/inquiry';
import { emailSendOnboardNewsletter } from '@/libraries/wrappers/email/on-board/newsletter';
import { segmentFullName } from '@/utilities/formatters/string';

export const contactAdd = async (
  formData: Partial<FormInquiryValues>,
  notify?: boolean
) => {
  try {
    if (!formData.email) {
      throw new Error('Email is required');
    }

    const now = new Date();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MAILERLITE_API_URL}/subscribers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_MAILERLITE_KEY_GENERAL}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fields: {
            name: segmentFullName(formData.name || '').first,
            last_name: segmentFullName(formData.name || '').last,
            phone: formData.phone || '',
          },
          groups: [process.env.NEXT_MAILERLITE_GROUP_GENERAL],
          status: 'active',
          subscribed_at: now.toISOString().replace('T', ' ').slice(0, 19),
          opted_in_at: now.toISOString().replace('T', ' ').slice(0, 19),
        }),
      }
    );

    if (response.status >= 400) {
      console.error(
        '---> route handler error (add email contact):',
        'API Service Error'
      );
      throw new Error('API Service Error');
    }

    if (notify && response.status == 201) {
      // send welcome email if new user
      await emailSendOnboardNewsletter({ to: formData.email });
    }

    return response;
  } catch (error) {
    console.error('---> api service error (add email contact):', error);
    throw error;
  }
};
