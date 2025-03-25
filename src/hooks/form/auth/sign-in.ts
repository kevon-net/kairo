'use client';

import { useForm } from '@mantine/form';
import { useState } from 'react';
import { showNotification } from '@/utilities/notifications';
import { Variant } from '@/enums/notification';
import { email } from '@/utilities/validators/email';
import { useNetwork } from '@mantine/hooks';
import { signIn } from '@/handlers/events/auth';
import { AuthAction } from '@/types/auth';
import { getUrlParam } from '@/utilities/helpers/url';
import { URL_PARAM } from '@/data/constants';
import { useRouter } from 'next/navigation';

export const useFormAuthSignIn = (params: { action: AuthAction }) => {
  const networkStatus = useNetwork();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: { email: '', remember: false },

    validate: {
      email: (value) => email(value.trim()),
    },
  });

  const parseValues = () => {
    return {
      email: form.values.email.trim().toLowerCase(),
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

        const { redirect } = await signIn({
          formData: parseValues(),
          options: {
            action: params.action,
            redirectUrl: getUrlParam(URL_PARAM.REDIRECT),
          },
        });

        router.push(redirect);

        form.reset();
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

  return { form, submitted, handleSubmit };
};
