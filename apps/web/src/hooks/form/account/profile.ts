import { useForm } from '@mantine/form';
import { useState } from 'react';
import { profileUpdate } from '@/handlers/requests/database/profile';
import { Variant } from '@repo/enums';
import { AUTH_URLS, BASE_URL, TIMEOUT } from '@/data/constants';
import { useSignOut } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import { showNotification } from '@/utilities/notifications';
import { errors, text } from '@repo/utils/validators';
import { setRedirectUrl } from '@repo/utils/helpers';
import { capitalizeWords, segmentFullName } from '@repo/utils/formatters';
import { ProfileGet } from '@repo/types/models';
import { useNetwork } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSession } from '@/libraries/redux/slices/session';

export const useFormUserProfile = (profileData: ProfileGet) => {
  const router = useRouter();
  const networkStatus = useNetwork();
  const pathname = usePathname();

  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();
  const { signOut } = useSignOut();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      name: {
        first: segmentFullName(profileData.name || '').first,
        last: segmentFullName(profileData.name || '').last,
      },
      phone: {
        code: profileData.phone?.split(' ')[0] || '',
        number: profileData.phone?.split(' ')[1] || '',
      },
    },

    validate: {
      name: {
        first: (value) =>
          value?.trim().length > 0 ? text(value, 2, 48) : errors.isEmpty,
        last: (value) =>
          value?.trim().length > 0 ? text(value, 2, 48) : errors.isEmpty,
      },
      phone: {
        code: (value, values) =>
          values.phone.number.trim().length > 0 && value?.trim().length < 1,
        number: (value) =>
          value.trim().length > 0 &&
          (value.trim().length < 7 || value.trim().length > 15),
      },
    },
  });

  const parseValues = () => {
    const firstName = form.values.name.first.trim();
    const lastName = form.values.name.last.trim();
    const code = form.values.phone.code.trim();
    const number = form.values.phone.number.trim();

    return {
      name: capitalizeWords(`${firstName} ${lastName}`),
      phone: number && number.length > 0 ? `${code} ${number}` : '',
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

        if (!form.isDirty()) {
          showNotification({
            variant: Variant.WARNING,
            title: 'Nothing Updated',
            desc: 'Update at least one form field',
          });
          return;
        }

        setSubmitted(true);

        const response = await profileUpdate({
          ...parseValues(),
          id: session?.user.id,
        });

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        if (response.ok) {
          if (session && session.user.name != parseValues().name) {
            dispatch(
              updateSession({
                ...session,
                user: { ...session?.user, ...parseValues() },
              })
            );
          }

          window.location.reload();
          return;
        }

        form.reset();

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
    }
  };

  return {
    form,
    submitted,
    handleSubmit,
    session,
  };
};
