import { emailSend } from '@/handlers/requests/email/send';
import { Variant } from '@repo/enums';
import { showNotification } from '@/utilities/notifications';
import { capitalizeWords } from '@repo/utils/formatters';
import { email } from '@repo/utils/validators';
import { hasLength, useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useState } from 'react';

export const useFormEmailInquiry = (
  initialValues?: {
    subject?: string;
    message?: string;
  },
  options?: { close?: () => void }
) => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm({
    initialValues: {
      from: { name: '', email: '' },
      subject: initialValues?.subject || '',
      phone: '',
      message: initialValues?.message || '',
    },

    validate: {
      from: {
        name: hasLength(2, 24),
        email: (value) => email(value.trim()),
      },
      subject: hasLength(3, 255),
      phone: hasLength(7, 15),
      message: hasLength(3, 2048),
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
            variant: Variant.WARNING,
            title: 'Network Error',
            desc: 'Please check your internet connection.',
          });
          return;
        }

        setSubmitted(true);

        const response = await emailSend(parseValues());

        if (!response) {
          throw new Error('No response from server');
        }

        const result = await response.json();

        form.reset();

        if (response.ok) {
          if (options?.close) {
            options.close();
          }

          showNotification({ variant: Variant.SUCCESS }, response, result);
          return;
        }

        showNotification({ variant: Variant.FAILED }, response, result);
        return;
      } catch (error) {
        showNotification({
          variant: Variant.FAILED,
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
