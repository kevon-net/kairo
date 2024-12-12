import { passwordForgot } from '@/handlers/requests/auth/password';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AUTH_URLS, KEY, TIMEOUT } from '@/data/constants';
import { Variant } from '@repo/enums';
import { showNotification } from '@/utilities/notifications';
import { userUpdate } from '@/handlers/requests/database/user';
import { millToMinSec, MinSec } from '@repo/utils/formatters';
import { email, password, compare } from '@repo/utils/validators';
import { getUrlParam, setRedirectUrl, decrypt } from '@repo/utils/helpers';
import { useNetwork } from '@mantine/hooks';

export const useFormAuthPasswordForgot = () => {
  const [sending, setSending] = useState(false);
  const [requested, setRequested] = useState(false);
  const [time, setTime] = useState<MinSec | null>(null);
  const networkStatus = useNetwork();

  const form = useForm({
    initialValues: { email: '' },
    validate: { email: (value) => email(value) },
  });

  const router = useRouter();

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

        setSending(true);
        setRequested(true);

        const response = await passwordForgot({
          email: form.values.email.trim().toLowerCase(),
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        form.reset();

        if (response.ok) {
          setTime(null);

          // redirect to notification page
          router.push(AUTH_URLS.VERIFY_REQUEST);
          return;
        }

        if (response.status === 409) {
          // update time
          setTime(millToMinSec(result.expiry)!);
          return;
        }

        setTime(null);

        if (response.status === 404) {
          // redirect to notification page
          setTimeout(() => router.replace('/'), TIMEOUT.REDIRECT);

          showNotification({ variant: Variant.WARNING }, response, result);
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
        setSending(false);
        setRequested(false);
      }
    }
  };

  return { form, handleSubmit, sending, requested, time };
};

export const useFormAuthPasswordReset = () => {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const form = useForm({
    initialValues: { password: { initial: '', confirm: '' } },

    validate: {
      password: {
        initial: (value) => password(value.trim(), 8, 24),
        confirm: (value, values) =>
          compare.string(value, values.password.initial, 'Password'),
      },
    },
  });

  const handleSubmit = async () => {
    try {
      if (form.isValid()) {
        setSending(true);

        const parsed = await decrypt(getUrlParam('token'), KEY).catch(() => {
          throw new Error('Link is broken, expired or already used');
        });

        const response = await userUpdate({
          user: {
            password: form.values.password.initial.trim(),
            id: parsed.userId,
          },
          options: { password: 'reset', token: getUrlParam('token') },
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        form.reset();

        if (response.ok) {
          // redirect to sign in
          setTimeout(
            async () =>
              router.push(setRedirectUrl({ targetUrl: AUTH_URLS.SIGN_IN })),
            TIMEOUT.REDIRECT
          );

          showNotification({ variant: Variant.SUCCESS }, response, result);
          return;
        }

        if (response.status === 409) {
          showNotification({ variant: Variant.WARNING }, response, result);
          return;
        }

        showNotification({ variant: Variant.FAILED }, response, result);
        return;
      }
    } catch (error) {
      showNotification({
        variant: Variant.FAILED,
        desc: (error as Error).message,
      });
      return;
    } finally {
      setSending(false);
    }
  };

  return { form, handleSubmit, sending };
};
