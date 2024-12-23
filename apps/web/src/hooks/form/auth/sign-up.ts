import { compare, email, password } from '@repo/utils/validators';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { showNotification } from '@/utilities/notifications';
import { Variant } from '@repo/enums';
import { useNetwork } from '@mantine/hooks';
import { signUp } from '@/handlers/events/auth-supa';

export const useFormAuthSignUp = () => {
  const networkStatus = useNetwork();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      // name: { first: '', last: '' },
      password: { initial: '', confirm: '' },
    },

    validate: {
      email: (value) => email(value.trim()),
      // name: {
      //   first: (value) => text(value.trim(), 2, 24),
      //   last: (value) => text(value.trim(), 2, 24),
      // },
      password: {
        initial: (value) => password(value.trim(), 8, 32),
        confirm: (value, values) =>
          compare.string(values.password.initial, value, 'Password'),
      },
    },
  });

  const parseValues = () => {
    return {
      // name: `${capitalizeWords(form.values.name.first.trim())} ${capitalizeWords(form.values.name.last.trim())}`,
      email: form.values.email.trim().toLowerCase(),
      password: form.values.password.confirm.trim(),
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

        await signUp(parseValues());
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
