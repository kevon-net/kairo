import { useForm } from '@mantine/form';
import { useState } from 'react';
import password from '@/utilities/validators/special/password';
import compare from '@/utilities/validators/special/compare';
import { userUpdate } from '@/handlers/requests/database/user';
import { timeout } from '@/data/constants';
import { Variant } from '@/enums/notification';
import { showNotification } from '@/utilities/notifications';
import { useSignOut } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@/utilities/helpers/url';
import { useNetwork } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSession } from '@/libraries/redux/slices/session';

export const useFormUserAccountPassword = (params: {
  credentials: boolean;
}) => {
  const router = useRouter();
  const networkStatus = useNetwork();
  const pathname = usePathname();

  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();

  const { signOut } = useSignOut();

  const [sending, setSending] = useState(false);

  const form = useForm({
    initialValues: {
      current: '',
      password: { initial: '', confirm: '' },
      credentials: params.credentials,
    },

    validate: {
      current: (value) => params.credentials && password(value, 8, 24),
      password: {
        initial: (value, values) =>
          value == values.current
            ? 'Current and new passwords cannot be the same'
            : password(value, 8, 24),
        confirm: (value, values) =>
          compare.string(value, values.password.initial, 'Password'),
      },
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

        setSending(true);

        const response = await userUpdate({
          user: {
            password: form.values.password.initial.trim(),
            id: session?.user.id,
          },
          options: {
            password: session?.user.withPassword
              ? form.values.current.trim()
              : 'update',
          },
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        form.reset();

        if (response.ok && session) {
          if (!session.user.withPassword) {
            // update the session data on the client-side
            dispatch(
              updateSession({
                ...session,
                user: { ...session.user, withPassword: true },
              })
            );

            // refresh the page
            setTimeout(() => router.refresh(), timeout.redirect);

            showNotification({ variant: Variant.SUCCESS }, response, result);
            return;
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

          showNotification({ variant: Variant.FAILED }, response, result);
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
      }
    }
  };

  return {
    form,
    sending,
    handleSubmit,
  };
};
