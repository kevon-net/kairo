'use server';

import { NotificationGet } from '@/types/models/notification';
import webpush from '../web-push';

export const sendPushNotification = async (
  notificationSub: NotificationGet,
  notificationData: Partial<Notification>
) => {
  try {
    await webpush.sendNotification(
      {
        endpoint: notificationSub.endpoint,
        keys: {
          p256dh: notificationSub.p256dh,
          auth: notificationSub.auth,
        },
      },
      JSON.stringify(notificationData)
    );
  } catch (error) {
    console.error('---> wrapper error - (send web push):', error);
    throw error;
  }
};
