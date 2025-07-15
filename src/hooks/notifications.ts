import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from './redux';
import { sendPushNotification } from '@/libraries/wrappers/push-notification';
import { NotificationGet } from '@/types/models/notification';
import { usePathname } from 'next/navigation';
import { linkify } from '@/utilities/formatters/string';
import { SessionRelations } from '@/types/models/session';

export const useNotificationReminder = (props: {
  sessions: SessionRelations[] | null;
}) => {
  const { isGranted } = useNotificationPermission();
  const pathname = usePathname();

  const stateNotifications = useAppSelector(
    (state) => state.notifications.value
  );

  useEffect(() => {
    const alignToNextMinute = () => {
      const now = new Date();
      const secondsUntilNextMinute = 60 - now.getSeconds();
      return secondsUntilNextMinute * 1000; // Convert to milliseconds
    };

    // Set a timeout to align the first execution to the start of the next minute
    const timeoutId = setTimeout(() => {
      // Run the check immediately at the start of the minute
      checkForReminder({
        sessions: props.sessions,
        notifications: stateNotifications,
        isGranted,
        currentUrl: pathname,
      });

      // Set an interval to run every 60 seconds thereafter
      const intervalId = setInterval(() => {
        checkForReminder({
          sessions: props.sessions,
          notifications: stateNotifications,
          isGranted,
          currentUrl: pathname,
        });
      }, 60000); // 60 seconds

      // Cleanup the interval on unmount
      return () => clearInterval(intervalId);
    }, alignToNextMinute());

    // Cleanup the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [props.sessions]);
};

const checkForReminder = (props: {
  sessions: SessionRelations[] | null;
  notifications: NotificationGet[] | null;
  isGranted: boolean;
  currentUrl: string;
}) => {
  try {
    if (props.sessions == null) return;

    props.sessions.forEach(async (session) => {
      const now = new Date();
      const timeDifference = session.created_at.getTime() - now.getTime();
      const secondsDifference = Math.floor(timeDifference / 1000);
      const sessionDuration = session.duration || 25 * 60; // Default to 25 minutes if not set
      const sessionComplete = sessionDuration == secondsDifference - 1;

      if (sessionComplete) {
        if (!props.isGranted) {
          // request notification permission
          // setup modal
        } else {
          if (props.notifications == null) return;
          if (props.notifications.length == 0) return;

          const registrationExisting = await navigator.serviceWorker.ready;
          const subscriptionExisting =
            await registrationExisting.pushManager.getSubscription();

          if (!subscriptionExisting) throw new Error('Subscription not found');

          const currentNotification = props.notifications.find(
            (n) => n.endpointId == linkify(subscriptionExisting.endpoint)
          );

          if (!currentNotification) throw new Error('Notification not found');

          await sendPushNotification(currentNotification, {
            title: 'Session Complete',
            body: session.title,
            data: { url: props.currentUrl || '/' },
          });
        }

        notifications.show({
          id: session.id,
          message: session.title,
          position: 'top-right',
          autoClose: false,
        });
      }
    });
  } catch (error) {
    console.error('Error checking for reminder:', error);
    return null;
  }
};

type NotificationPermissionState = 'default' | 'granted' | 'denied';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermissionState>(
    () => {
      return typeof Notification !== 'undefined'
        ? Notification.permission
        : 'default';
    }
  );

  const updatePermission = useCallback(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('This browser does not support notifications.');
      return;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', updatePermission);
    return () => {
      document.removeEventListener('visibilitychange', updatePermission);
    };
  }, [updatePermission]);

  return {
    permission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
    requestPermission,
  };
};
