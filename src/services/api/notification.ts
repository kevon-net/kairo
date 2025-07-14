import {
  notificationCreate,
  notificationGet,
} from '@/handlers/requests/database/notifications';
import { createClient } from '@/libraries/supabase/client';
import { NotificationGet } from '@/types/models/notification';
import { linkify } from '@/utilities/formatters/string';
import { generateUUID } from '@/utilities/generators/id';
import {
  arrayBufferToBase64,
  urlBase64ToUint8Array,
} from '@/utilities/helpers/string';

export const subscribeUser = async (
  registration: ServiceWorkerRegistration
) => {
  try {
    // Check if there's already a subscription
    const registrationExisting = await navigator.serviceWorker.ready;
    const subscriptionExisting =
      await registrationExisting.pushManager.getSubscription();

    // console.log('subscriptionExisting', subscriptionExisting);

    if (!subscriptionExisting) {
      console.log('Push subscription missing or expired. Renewing');

      const supabase = createClient();
      const { data: session } = await supabase.auth.getUser();

      if (!session.user) throw new Error('Profile ID is required');
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        throw new Error('VAPID key is required');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      });

      const keys = {
        auth: subscription.getKey('auth'),
        p256dh: subscription.getKey('p256dh'),
      };

      if (!keys.auth) throw new Error('Auth key is required');
      if (!keys.p256dh) throw new Error('P256DH key is required');

      // Send subscription to your server to store it
      const { notification }: { notification: NotificationGet } =
        await notificationCreate({
          id: generateUUID(),
          endpoint: subscription.endpoint,
          endpointId: linkify(subscription.endpoint),
          expirationTime: subscription.expirationTime,
          auth: arrayBufferToBase64(keys.auth),
          p256dh: arrayBufferToBase64(keys.p256dh),
          profile_id: session.user.id,
        });

      return notification;
    } else {
      const { notification }: { notification: NotificationGet } =
        await notificationGet({
          endpointId: linkify(subscriptionExisting.endpoint),
        });

      console.log(
        'Already subscribed to push notifications. No action needed.'
        // , notification
      );
      return notification;
    }
  } catch (error) {
    console.error('Error subscribing user to push notifications:', error);
    return null;
  }
};
