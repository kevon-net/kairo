import { emailCreate } from '@/handlers/requests/email/email';
import { NotificationVariant } from '@/types/enums';
import { capitalizeWords } from '@/utilities/formatters/string';
import { showNotification } from '@/utilities/notifications';
import email from '@/utilities/validators/special/email';
import phone from '@/utilities/validators/special/phone';
import text from '@/utilities/validators/special/text';
import { useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useState } from 'react';

export const useFormEmailInquiry = () => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm({
    initialValues: {
      from: { name: '', email: '' },
      subject: '',
      phone: '',
      message: '',
    },

    validate: {
      from: {
        name: (value) => text(value.trim(), 2, 24),
        email: (value) => email(value.trim()),
      },
      subject: (value) => text(value.trim(), 3, 255, true),
      phone: (value) => value.trim().length > 0 && phone(value),
      message: (value) => text(value.trim(), 3, 2048, true),
    },
  });

  const parseValues = () => {
    return {
      from: {
        name: capitalizeWords(form.values.from.name.trim()),
        email: form.values.from.email.trim().toLowerCase(),
      },
      subject: form.values.subject.trim(),
      phone: form.values.phone.trim(),
      message: form.values.message.trim(),
    };
  };

  const handleSubmit = async () => {
    if (form.isValid()) {
      try {
        if (!networkStatus.online) {
          showNotification({
            variant: NotificationVariant.WARNING,
            title: 'Network Error',
            desc: 'Please check your internet connection.',
          });
          return;
        }

        setSubmitted(true);

        const response = await emailCreate(parseValues());

        if (!response) {
          throw new Error('No response from server');
        }

        const result = await response.json();

        form.reset();

        if (response.ok) {
          showNotification(
            { variant: NotificationVariant.SUCCESS },
            response,
            result
          );
          return;
        }

        showNotification(
          { variant: NotificationVariant.FAILED },
          response,
          result
        );
        return;
      } catch (error) {
        showNotification({
          variant: NotificationVariant.FAILED,
          desc: (error as Error).message,
        });
        return;
      } finally {
        setSubmitted(false);
      }
    }
  };

  return {
    form,
    submitted,
    handleSubmit,
  };
};
