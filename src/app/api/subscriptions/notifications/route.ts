import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { NotificationGet } from '@/types/models/notification';
import { linkify } from '@/utilities/formatters/string';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    const notificationsRecords = await prisma.notification.findFirst({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      { items: notificationsRecords },
      { status: 200, statusText: 'Notification Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get notifications):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      notifications,
      deletedIds,
    }: { notifications: NotificationGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.notification.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    const updateNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const updateOperation = await prisma.notification.upsert({
          where: { id: notification.id },
          update: {
            auth: notification.auth,
            endpoint: notification.endpoint,
            endpointId: linkify(notification.endpoint),
            expirationTime: notification.expirationTime,
            p256dh: notification.p256dh,
            updated_at: new Date(notification.updated_at),
          },
          create: {
            id: notification.id,
            auth: notification.auth,
            endpoint: notification.endpoint,
            endpointId: linkify(notification.endpoint),
            expirationTime: notification.expirationTime,
            p256dh: notification.p256dh,
            sync_status: notification.sync_status,
            created_at: new Date(notification.created_at),
            updated_at: new Date(notification.updated_at),
            profile_id: notification.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateNotifications },
      { status: 200, statusText: 'Notifications Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update notifications):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
