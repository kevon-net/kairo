import phone from '@/utilities/validators/special/phone';
import text from '@/utilities/validators/special/text';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { profileUpdate } from '@/handlers/requests/database/profile';
import { NotificationVariant } from '@/types/enums';
import { showNotification } from '@/utilities/notifications';
import { timeout } from '@/data/constants';
import { useSignOut } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@/utilities/helpers/url';
import {
  capitalizeWords,
  segmentFullName,
} from '@/utilities/formatters/string';
import { useNetwork } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSession } from '@/libraries/redux/slices/session';

export const useFormUserProfile = () => {
  const router = useRouter();
  const networkStatus = useNetwork();
  const pathname = usePathname();

  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();
  const { signOut } = useSignOut();

  const [submitted, setSubmitted] = useState(false);

  const name = session?.user.name;

  const form = useForm({
    initialValues: {
      name: {
        first: !name ? '' : segmentFullName(name).first,
        last: !name ? '' : segmentFullName(name).last,
      },
      phone: '',
    },

    validate: {
      name: {
        first: (value) =>
          value?.trim().length > 0
            ? text(value, 2, 48)
            : 'Please fill out this field.',
        last: (value) =>
          value?.trim().length > 0
            ? text(value, 2, 48)
            : 'Please fill out this field.',
      },
      phone: (value) => value.trim().length > 0 && phone(value),
    },
  });

  const parseValues = () => {
    return {
      name: capitalizeWords(
        `${form.values.name.first.trim()} ${form.values.name.last.trim()}`
      ),
      // phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : "",
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

        if (!form.isDirty()) {
          showNotification({
            variant: NotificationVariant.WARNING,
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

        form.reset();

        if (response.ok) {
          if (session) {
            dispatch(
              updateSession({
                ...session,
                user: { ...session?.user, ...parseValues() },
              })
            );
          }

          showNotification(
            { variant: NotificationVariant.SUCCESS },
            response,
            result
          );
          return;
        }

        if (response.status === 401) {
          // redirect to sign in
          setTimeout(
            async () => router.push(setRedirectUrl(pathname)),
            timeout.redirect
          );

          showNotification(
            { variant: NotificationVariant.WARNING },
            response,
            result
          );
          return;
        }

        if (response.status === 404) {
          // sign out
          setTimeout(async () => await signOut(), timeout.redirect);

          showNotification(
            { variant: NotificationVariant.FAILED },
            response,
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

  return {
    form,
    submitted,
    handleSubmit,
    session,
  };
};
