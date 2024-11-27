import { replyCommentCreate } from '@/handlers/requests/database/reply/comment';
import { replyReplyCreate } from '@/handlers/requests/database/reply/reply';
import { NotificationVariant } from '@/types/enums';
import { capitalizeWords } from '@/utilities/formatters/string';
import { showNotification } from '@/utilities/notifications';
import email from '@/utilities/validators/special/email';
import text from '@/utilities/validators/special/text';
import { useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useFormBlogReply = (params: {
  commentId?: string;
  replyCommentId?: string;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      content: '',
    },

    validate: {
      name: (value) => text(value.trim(), 2, 24),
      email: (value) => email(value.trim()),
      content: (value) => text(value.trim(), 3, 2048, true),
    },
  });

  const parseValues = () => {
    return {
      name: capitalizeWords(form.values.name.trim()),
      // email: form.values.email.trim().toLowerCase(),
      content: form.values.content.trim(),
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

        setSubmitted(true);

        let response;

        if (params.commentId) {
          response = await replyCommentCreate({
            ...parseValues(),
            commentId: params.commentId,
          });
        }

        if (params.replyCommentId) {
          response = await replyReplyCreate({
            ...parseValues(),
            replyCommentId: params.replyCommentId,
          });
        }

        if (!response) {
          throw new Error('No response from server');
        }

        const result = await response.json();

        form.reset();

        if (response.ok) {
          router.refresh();
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
  };
};
