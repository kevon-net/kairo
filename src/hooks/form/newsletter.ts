import { contactCreate } from '@/handlers/requests/email/contact';
import { NotificationVariant } from '@/types/enums';
import { showNotification } from '@/utilities/notifications';
import email from '@/utilities/validators/special/email';
import { useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useState } from 'react';

export const useFormNewsletter = () => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm({
    initialValues: { email: '' },
    validate: { email: (value) => email(value.trim()) },
  });

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

        const response = await contactCreate({
          params: { email: form.values.email.trim().toLowerCase() },
        });

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

        if (result.exists) {
          showNotification(
            { variant: NotificationVariant.WARNING },
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
