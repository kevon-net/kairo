import { getUrlParam } from '@repo/utils/helpers';
import { email, errors } from '@repo/utils/validators';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { URL_PARAM, TIMEOUT } from '@/data/constants';
import { showNotification } from '@/utilities/notifications';
import { Variant } from '@repo/enums';
import { useNetwork, useOs } from '@mantine/hooks';
import { signIn } from '@/handlers/events/auth';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';

export const useFormAuthSignIn = () => {
  const router = useRouter();
  const os = useOs();
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '', remember: false },

    validate: {
      email: (value) => email(value.trim()),
      password: (value) => (value.trim().length > 0 ? null : errors.isEmpty),
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
            variant: Variant.WARNING,
            title: 'Network Error',
            desc: 'Please check your internet connection.',
          });
          return;
        }

        setSubmitted(true);

        const response = await signIn({
          provider: Provider.CREDENTIALS,
          credentials: parseValues(),
          device: {
            os,
          },
        });

        const result = await response.json();

        if (!result) throw new Error('No response from server');

        form.reset();

        if (!result.error) {
          // apply redirect url
          window.location.replace(getUrlParam(URL_PARAM.REDIRECT));
          return;
        }

        if (response.status == 404 || response.status == 401) {
          showNotification({
            variant: Variant.FAILED,
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
            TIMEOUT.REDIRECT
          );

          showNotification(
            {
              variant: Variant.WARNING,
              title: 'Not Verified',
              desc: 'User not verified. Redirecting...',
            },
            undefined,
            result
          );
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

  return { form, submitted, handleSubmit };
};
