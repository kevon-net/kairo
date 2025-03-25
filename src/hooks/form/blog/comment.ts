import { commentCreate } from '@/handlers/requests/database/comment';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Variant } from '@/enums/notification';
import { capitalizeWords } from '@/utilities/formatters/string';
import { email } from '@/utilities/validators/email';
import { showNotification } from '@/utilities/notifications';
import { hasLength, useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useState } from 'react';
import { updateComments } from '@/libraries/redux/slices/comments';
import { usePathname } from 'next/navigation';

export const useFormBlogComment = (params: { postId: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();
  const pathname = usePathname();

  const session = useAppSelector((state) => state.session.value);
  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: session?.user_metadata.name || '',
      email: session?.email || '',
      content: '',
    },

    validate: {
      name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      email: (value) => email(value.trim()),
      content: hasLength(
        { min: 3, max: 2048 },
        'Between 3 and 2048 characters'
      ),
    },
  });

  const parseValues = () => {
    return {
      name: capitalizeWords(form.values.name.trim()),
      // email: form.values.email.trim().toLowerCase(),
      content: form.values.content.trim(),
      postId: params.postId,
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

        const response = await commentCreate({
          ...parseValues(),
          profileId: session?.id,
        });

        if (!response) {
          throw new Error('No response from server');
        }

        const result = await response.json();

        form.reset();

        if (response.ok) {
          window.location.replace(`${pathname}#page-post-comment`);
          dispatch(updateComments([result.comment, ...comments]));
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
