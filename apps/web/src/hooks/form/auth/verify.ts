import { useForm } from '@mantine/form';
import { useState } from 'react';
import {
  verify as handleVerify,
  verifyResend as handleVerifyResend,
} from '@/handlers/requests/auth/verify';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_URLS, BASE_URL, TIMEOUT } from '@/data/constants';
import { Variant } from '@repo/enums';
import { showNotification } from '@/utilities/notifications';
import { millToMinSec, MinSec } from '@repo/utils/formatters';
import { getUrlParam, setRedirectUrl } from '@repo/utils/helpers';
import { useNetwork } from '@mantine/hooks';

export const useFormAuthVerify = () => {
  const router = useRouter();
  const pathname = usePathname();
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);
  const [requested, setRequested] = useState(false);
  const [time, setTime] = useState<MinSec | null>(null);

  const form = useForm({
    initialValues: { otp: '' },
    validate: { otp: (value) => value.length != 6 && true },
  });

  const parseValues = () => {
    return {
      otp: form.values.otp.trim(),
      token: getUrlParam('token'),
      options: { userId: getUrlParam('userId') },
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

        const response = await handleVerify(parseValues());

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        setTime(null);
        form.reset();

        if (response.ok) {
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

          showNotification({ variant: Variant.SUCCESS }, response, result);
          return;
        }

        if (response.status === 404) {
          if (response.statusText.includes('User')) {
            // redirect to home page
            setTimeout(() => router.replace('/'), TIMEOUT.REDIRECT);
          }

          showNotification({ variant: Variant.FAILED }, response, result);
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
    }
  };

  const handleRequest = async () => {
    try {
      setRequested(true);

      const response = await handleVerifyResend({
        userId: getUrlParam('userId'),
        token: parseValues().token,
      });

      if (!response) throw new Error('No response from server');

      const result = await response.json();

      form.reset();

      if (response.ok) {
        setTime(null);

        // redirect to new verification page
        setTimeout(
          () =>
            window.location.replace(
              `/auth/verify?token=${result.token}&userId=${result.user.id}`
            ),
          TIMEOUT.REDIRECT
        );

        showNotification({ variant: Variant.SUCCESS }, response, result);
        return;
      }

      if (response.statusText === 'Already Sent') {
        setTime(millToMinSec(result.otp.expiry)!);

        showNotification({ variant: Variant.WARNING }, response, result);
        return;
      }

      setTime(null);

      if (response.status === 404) {
        // redirect to home page
        setTimeout(() => router.replace('/'), TIMEOUT.REDIRECT);

        showNotification({ variant: Variant.FAILED }, response, result);
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
      setRequested(false);
    }
  };

  return {
    form,
    handleSubmit,
    handleRequest,
    submitted,
    requested,
    time,
  };
};
