import IconNotification from '@/components/common/icons/notification';
import { Variant } from '@/enums/notification';
import { showNotification } from '@/utilities/notifications';
import { useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export const useFormUserAccountNotifications = () => {
  const [sending, setSending] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm({ initialValues: { settings: '' } });

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
      } catch (error) {
        notifications.show({
          id: 'notifications-update-failed',
          icon: IconNotification({ variant: Variant.FAILED }),
          title: `Send Failed`,
          message: (error as Error).message,
          variant: 'failed',
        });
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
