import { getUrlParam } from '@/utilities/helpers/url';
import email from '@/utilities/validators/special/email';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { timeout } from '@/data/constants';
import { showNotification } from '@/utilities/notifications';
import { NotificationVariant } from '@/types/enums';
import { useNetwork, useOs } from '@mantine/hooks';
import { signIn } from '@/handlers/events/auth';
import { Provider } from '@prisma/client';

export const useFormAuthSignIn = () => {
  const router = useRouter();
  const os = useOs();
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '', remember: false },

    validate: {
      email: (value) => email(value.trim()),
      password: (value) =>
        value.trim().length > 0 ? null : 'Please fill out this field',
    },
  });

  const parseValues = () => {
    return {
      email: form.values.email.trim().toLowerCase(),
      password: form.values.password.trim(),
      remember: form.values.remember,
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

        const response = await signIn(Provider.CREDENTIALS, parseValues(), {
          os,
        });
        const result = await response.json();

        if (!result) throw new Error('No response from server');

        form.reset();

        if (!result.error) {
          // apply redirect url
          window.location.replace(getUrlParam());
          return;
        }

        if (response.status == 404 || response.status == 401) {
          showNotification({
            variant: NotificationVariant.FAILED,
            title: 'Authentication Error',
            desc: 'Invalid username/password',
          });
          return;
        }

        if (response.status == 403) {
          // redirect to verification page
          setTimeout(
            () =>
              router.push(
                `/auth/verify/?token=${result.token}&userId=${result.user.id}`
              ),
            timeout.redirect
          );

          showNotification(
            {
              variant: NotificationVariant.WARNING,
              title: 'Not Verified',
              desc: 'User not verified. Redirecting...',
            },
            undefined,
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

  return { form, submitted, handleSubmit };
};
