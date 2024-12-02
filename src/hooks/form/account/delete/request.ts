import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Variant } from '@/enums/notification';
import { showNotification } from '@/utilities/notifications';
import { timeout } from '@/data/constants';
import { userDelete } from '@/handlers/requests/database/user';
import { useSignOut } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@/utilities/helpers/url';
import { useNetwork } from '@mantine/hooks';
import { useAppSelector } from '@/hooks/redux';
import { millToMinSec, MinSec } from '@/utilities/formatters/number';

export const useFormUserAccountDeleteRequest = (close?: () => void) => {
  const pathname = usePathname();
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState<MinSec | null>(null);

  const session = useAppSelector((state) => state.session.value);

  const { signOut } = useSignOut();

  const router = useRouter();

  const form = useForm({
    initialValues: { confirmation: '', password: '' },
    validate: {
      confirmation: (value) =>
        value.trim() != 'DELETE' && 'Please enter the confirmation phrase',
      password: (value) =>
        value.trim().length < 1 && 'Please fill in this field',
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

        const response = await userDelete({
          userId: session?.user.id || '',
          password: form.values.password.trim(),
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        form.reset();

        if (response.ok) {
          if (close) {
            close();
          }

          showNotification({ variant: Variant.SUCCESS }, response, result);
          return;
        }

        if (response.status === 401) {
          // redirect to sign in
          setTimeout(
            async () => router.push(setRedirectUrl(pathname)),
            timeout.redirect
          );

          showNotification({ variant: Variant.WARNING }, response, result);
          return;
        }

        if (response.status === 404) {
          // sign out
          setTimeout(async () => await signOut(), timeout.redirect);

          showNotification({ variant: Variant.WARNING }, response, result);
          return;
        }

        if (response.status === 409) {
          setTime(millToMinSec(result.expiry) || null);

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
        setSubmitted(false);
      }
    }
  };

  return {
    form,
    submitted,
    handleSubmit,
    time,
  };
};
