import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Variant } from '@repo/enums';
import { AUTH_URLS, BASE_URL, TIMEOUT } from '@/data/constants';
import { useSignOut } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useNetwork } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSession } from '@/libraries/redux/slices/session';
import { verify, verifyResend } from '@/handlers/requests/auth/verify';
import { showNotification } from '@/utilities/notifications';
import { setRedirectUrl } from '@repo/utils/helpers';
import { email } from '@repo/utils/validators';
import { userUpdate } from '@/handlers/requests/database/user';

export const useFormUserEmail = (close: () => void) => {
  const router = useRouter();
  const networkStatus = useNetwork();
  const pathname = usePathname();

  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();
  const { signOut } = useSignOut();

  const [submitted, setSubmitted] = useState(false);
  const [context, setContext] = useState<'email1' | 'email2'>('email1');
  const [code1Sent, setCode1Sent] = useState(false);
  const [code2Sent, setCode2Sent] = useState(false);

  const formCode = useForm({
    initialValues: { otp: '' },
    validate: {
      otp: (value) => value.trim().length != 6,
    },
  });

  const formEmail = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) =>
        value.trim() == session?.user.email
          ? 'Please enter a different email address'
          : email(value.trim()),
    },
  });

  const code1Send = async () => {
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

      const response = await verifyResend({
        userId: session?.user.id || '',
        token: null,
        options: {
          verified: true,
        },
      });

      if (!response) throw new Error('No response from server');

      const result = await response.json();

      if (response.ok) {
        setCode1Sent(true);
        return;
      }

      if (response.status === 409) {
        setCode1Sent(true);
        return;
      }

      if (response.status === 404) {
        // sign out
        setTimeout(async () => await signOut(), TIMEOUT.REDIRECT);

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
      setSubmitted(false);
    }
  };

  const handleSubmitCode1 = async () => {
    if (formCode.isValid()) {
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

        const response = await verify({
          otp: formCode.values.otp.trim(),
          token: null,
          options: { verified: true },
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        formCode.reset();

        if (response.ok) {
          setCode1Sent(false);
          setContext('email2');
          return;
        }

        if (response.status === 401) {
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

          showNotification({ variant: Variant.WARNING }, response, result);
          return;
        }

        if (response.statusText === 'Already Verified') {
          // redirect to sign in
          setTimeout(
            async () =>
              router.replace(
                setRedirectUrl({
                  targetUrl: AUTH_URLS.SIGN_IN,
                  redirectUrl: `${BASE_URL}/${pathname}`,
                })
              ),
            TIMEOUT.REDIRECT
          );

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
    } else {
      formCode.validate();
    }
  };

  const code2Send = async () => {
    if (formEmail.isValid()) {
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

        const response = await verifyResend({
          userId: session?.user.id || '',
          token: null,
          options: {
            verified: true,
            email: formEmail.values.email.trim().toLowerCase(),
          },
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        if (response.ok) {
          setCode2Sent(true);
          return;
        }

        if (response.status === 404) {
          // sign out
          setTimeout(async () => await signOut(), TIMEOUT.REDIRECT);

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
        setSubmitted(false);
      }
    } else {
      formEmail.validate();
    }
  };

  const handleSubmitCode2 = async () => {
    if (formCode.isValid()) {
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

        const response = await verify({
          otp: formCode.values.otp.trim(),
          token: null,
          options: { verified: true },
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        if (response.ok) {
          const response = await userUpdate({
            user: {
              email: formEmail.values.email.trim().toLowerCase(),
              id: session?.user.id,
            },
            options: { email: session?.user.email },
          });

          if (!response) throw new Error('No response from server');

          const result = await response.json();

          if (response.ok) {
            dispatch(
              updateSession({
                ...session,
                user: {
                  ...session?.user,
                  email: formEmail.values.email.trim().toLowerCase(),
                },
              })
            );

            setTimeout(async () => router.refresh(), TIMEOUT.REDIRECT);

            close();

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

        if (response.status === 401) {
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

          showNotification({ variant: Variant.WARNING }, response, result);
          return;
        }

        if (response.statusText === 'Already Verified') {
          // redirect to sign in
          setTimeout(
            async () =>
              router.replace(
                setRedirectUrl({
                  targetUrl: AUTH_URLS.SIGN_IN,
                  redirectUrl: `${BASE_URL}/${pathname}`,
                })
              ),
            TIMEOUT.REDIRECT
          );

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
    } else {
      formCode.validate();
    }
  };

  return {
    formCode,
    formEmail,
    submitted,
    context,
    code1Sent,
    code2Sent,

    code1Send,
    handleSubmitCode1,

    code2Send,
    handleSubmitCode2,

    session,
  };
};
