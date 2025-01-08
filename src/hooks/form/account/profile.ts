import { hasLength, useForm } from '@mantine/form';
import { useState } from 'react';
import { Variant } from '@/enums/notification';
import {
  capitalizeWords,
  segmentFullName,
} from '@/utilities/formatters/string';
import { showNotification } from '@/utilities/notifications';
import { useNetwork } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSession } from '@/libraries/redux/slices/session';
import { profileUpdate } from '@/services/database/profile';
import { createClient } from '@/libraries/supabase/client';
import { uploadFile } from '@/services/logic/upload';
import { FILE_NAME } from '@/data/constants';

export const useFormUserProfile = () => {
  const networkStatus = useNetwork();
  const supabase = createClient();
  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      name: {
        first: segmentFullName(session?.user_metadata.name || '').first,
        last: segmentFullName(session?.user_metadata.name || '').last,
      },
      // phone: {
      //   code: session?.phone?.split(' ')[0] || '',
      //   number: session?.phone?.split(' ')[1] || '',
      // },
      avatar: session?.user_metadata.avatar_url || '',
    },
    validate: {
      name: {
        first: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
        last: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      },
      // phone: {
      //   code: (value, values) =>
      //     values.phone.number.trim().length > 0 && value?.trim().length < 1,
      //   number: (value) =>
      //     value.trim().length > 0 &&
      //     (value.trim().length < 7 || value.trim().length > 15),
      // },
    },
  });

  const parseValues = () => {
    const firstName = form.values.name.first.trim();
    const lastName = form.values.name.last.trim();
    // const code = form.values.phone.code.trim();
    // const number = form.values.phone.number.trim();
    const avatar = form.values.avatar || session?.user_metadata.avatar_url;

    return {
      name: capitalizeWords(`${firstName} ${lastName}`),
      // phone: {
      //   withSpace: number && number.length > 0 ? `${code} ${number}` : '',
      //   withoutSpace: number && number.length > 0 ? `${code}${number}` : '',
      // },
      avatar,
    };
  };

  const handleSubmit = async () => {
    if (form.isValid()) {
      try {
        if (!networkStatus.online) {
          return showNotification({
            variant: Variant.WARNING,
            title: 'Network Error',
            desc: 'Please check your internet connection.',
          });
        }

        if (!session) {
          throw new Error('You must be signed in');
        }

        if (!form.isDirty()) {
          return showNotification({
            variant: Variant.WARNING,
            title: 'Nothing Updated',
            desc: 'Update at least one form field',
          });
        }

        setSubmitted(true);

        await profileUpdate({
          firstName: segmentFullName(parseValues().name).first,
          lastName: segmentFullName(parseValues().name).last,
          // phone: parseValues().phone.withSpace,
          avatar: parseValues().avatar,
          id: session?.id,
        });

        await dispatch(
          updateSession({
            ...session,
            // phone: parseValues().phone.withoutSpace,
            user_metadata: {
              ...session.user_metadata,
              name: parseValues().name,
              full_name: parseValues().name,
              picture: parseValues().avatar,
              avatar_url: parseValues().avatar,
            },
          })
        );

        const { error } = await supabase.auth.updateUser({
          data: {
            name: parseValues().name,
            full_name: parseValues().name,
            picture: parseValues().avatar,
            avatar_url: parseValues().avatar,
          },
        });

        if (error) {
          return showNotification({
            variant: Variant.FAILED,
            desc: (error as Error).message,
          });
        }

        window.location.reload();
      } catch (error) {
        showNotification({
          variant: Variant.FAILED,
          desc: (error as Error).message,
        });
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

export const useFormUserAvatar = () => {
  const networkStatus = useNetwork();

  const supabase = createClient();
  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();

  const [submitted, setSubmitted] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (!networkStatus.online) {
        return showNotification({
          variant: Variant.WARNING,
          title: 'Network Error',
          desc: 'Please check your internet connection.',
        });
      }

      if (!session) {
        throw new Error('You must be signed in');
      }

      setSubmitted(true);

      if (!file) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append(FILE_NAME.AVATAR, file);

      const { file: fileDetails } = await uploadFile({
        formData,
        profileId: session.id,
      });

      await profileUpdate({ id: session.id, avatar: fileDetails.path });

      await dispatch(
        updateSession({
          ...session,
          // phone: parseValues().phone.withoutSpace,
          user_metadata: {
            ...session.user_metadata,
            picture: fileDetails.path,
            avatar_url: fileDetails.path,
          },
        })
      );

      const { error } = await supabase.auth.updateUser({
        data: {
          picture: fileDetails.path,
          avatar_url: fileDetails.path,
        },
      });

      if (error) {
        return showNotification({
          variant: Variant.FAILED,
          desc: (error as Error).message,
        });
      }

      window.location.reload();
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

  return {
    submitted,
    handleSubmit,
    session,
    file,
    setFile,
    preview,
    setPreview,
  };
};
