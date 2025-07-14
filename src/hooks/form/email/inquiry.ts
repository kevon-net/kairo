import { emailSend } from '@/handlers/requests/email/send';
import { Variant } from '@/enums/notification';
import { showNotification } from '@/utilities/notifications';
import { capitalizeWords } from '@/utilities/formatters/string';
import { email } from '@/utilities/validators/email';
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
        name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
        email: (value) => email(value.trim()),
      },
      subject: hasLength({ min: 2, max: 255 }, 'Between 2 and 255 characters'),
      phone: hasLength({ min: 7, max: 15 }, 'Between 7 and 15 characters'),
      message: hasLength(
        { min: 3, max: 2048 },
        'Between 3 and 2048 characters'
      ),
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
