import { signUp as handleSignUp } from '@/handlers/requests/auth/sign-up';
import { capitalizeWords } from '@repo/utils/formatters';
import { compare, email, password, text } from '@repo/utils/validators';
import { setRedirectUrl } from '@repo/utils/helpers';
import { useForm } from '@mantine/form';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AUTH_URLS, BASE_URL, TIMEOUT } from '@/data/constants';
import { showNotification } from '@/utilities/notifications';
import { Variant } from '@repo/enums';
import { useNetwork } from '@mantine/hooks';

export const useFormAuthSignUp = () => {
  const router = useRouter();
  const pathname = usePathname();
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      name: { first: '', last: '' },
      password: { initial: '', confirm: '' },
    },

    validate: {
      email: (value) => email(value.trim()),
      name: {
        first: (value) => text(value.trim(), 2, 24),
        last: (value) => text(value.trim(), 2, 24),
      },
      password: {
        initial: (value) => password(value.trim(), 8, 32),
        confirm: (value, values) =>
          compare.string(values.password.initial, value, 'Password'),
      },
    },
  });

  const parseValues = () => {
    return {
      name: `${capitalizeWords(form.values.name.first.trim())} ${capitalizeWords(form.values.name.last.trim())}`,
      email: form.values.email.trim().toLowerCase(),
      password: {
        initial: form.values.password.initial.trim(),
        confirm: form.values.password.confirm.trim(),
      },
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

        const response = await handleSignUp(parseValues());

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        form.reset();

        if (response.ok) {
          // redirect to verification page
          router.push(
            `/auth/verify?token=${result.token}&userId=${result.user.id}`
          );
          return;
        }

        if (response.statusText === 'User Exists') {
          setTimeout(async () => {
            if (!result.user.verified) {
              // redirect to verification page
              router.push(
                `/auth/verify?token=${result.token}&userId=${result.user.id}`
              );
              return;
            }

            // redirect to sign in
            setTimeout(
              async () =>
                router.push(
                  setRedirectUrl({
                    targetUrl: AUTH_URLS.SIGN_IN,
                    redirectUrl: `${BASE_URL}/${pathname}`,
                  })
                ),
              TIMEOUT.REDIRECT
            );
          }, TIMEOUT.REDIRECT);

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

  return { form, handleSubmit, submitted };
};
