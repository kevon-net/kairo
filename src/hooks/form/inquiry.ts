import { Variant } from '@/enums/notification';
import { showNotification } from '@/utilities/notifications';
import { capitalizeWords } from '@/utilities/formatters/string';
import { email } from '@/utilities/validators/email';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useState } from 'react';
import { handleInquiry } from '@/handlers/requests/email/inquiry';
import { contactAdd } from '@/handlers/requests/contact';

export type FormInquiryValues = {
  name: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
};

export type FormInquiry = UseFormReturnType<
  FormInquiryValues,
  (values: FormInquiryValues) => FormInquiryValues
>;

export const useFormEmailInquiry = (
  initialValues?: Partial<FormInquiryValues>,
  options?: { close?: () => void }
) => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: initialValues?.subject || '',
      phone: '',
      message: initialValues?.message || '',
    },

    validate: {
      name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      email: (value) => email(value.trim()),
      subject: hasLength({ min: 2, max: 255 }, 'Between 2 and 255 characters'),
      phone: hasLength({ min: 7, max: 15 }, 'Between 7 and 15 characters'),
      message: hasLength(
        { min: 3, max: 2048 },
        'Between 3 and 2048 characters'
      ),
    },
  });

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

        const response = await handleInquiry(parseFormValues(form.values));

        if (!response) {
          throw new Error('No response from server');
        }

        const result = await response.json();

        form.reset();

        if (response.ok) {
          if (options?.close) {
            options.close();
          }

          const addContact = await contactAdd(parseFormValues(form.values));

          if (!addContact.ok) {
            console.error('Error adding contact');
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

const parseFormValues = (formValues: FormInquiryValues): FormInquiryValues => {
  return {
    name: capitalizeWords(formValues.name.trim()),
    email: formValues.email.trim().toLowerCase(),
    subject: formValues.subject.trim(),
    phone: formValues.phone.trim(),
    message: formValues.message.trim(),
  };
};
