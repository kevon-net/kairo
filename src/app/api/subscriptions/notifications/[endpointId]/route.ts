import prisma from '@/libraries/prisma';
import {
  NotificationCreate,
  NotificationUpdate,
} from '@/types/models/notification';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  try {
    const { endpointId } = await params;

    const notificationRecord = await prisma.notification.findUnique({
      where: { endpointId },
    });

    return NextResponse.json(
      { notification: notificationRecord },
      { status: 200, statusText: 'Notification Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get notification):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  try {
    const { endpointId } = await params;

    const notification: Omit<NotificationCreate, 'profile'> & {
      profile_id: string;
    } = await request.json();

    // upsert record
    const createdOrFound = await prisma.notification.upsert({
      where: { endpointId },
      update: {},
      create: notification,
    });

    const wasCreated = createdOrFound.created_at === createdOrFound.updated_at;

    return NextResponse.json(
      { notification: createdOrFound },
      {
        status: 200,
        statusText: wasCreated ? 'Notification Created' : 'Notification Exists',
      }
    );
  } catch (error) {
    console.error('---> route handler error (create notification):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  try {
    const { endpointId } = await params;

    const notification: NotificationUpdate = await request.json();

    const updateNotification = await prisma.notification.update({
      where: { endpointId },
      data: notification,
    });

    return NextResponse.json(
      { notification: updateNotification },
      { status: 200, statusText: 'Notification Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update notification):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  try {
    const { endpointId } = await params;

    const deleteNotification = await prisma.notification.delete({
      where: { endpointId },
    });

    return NextResponse.json(
      { notification: deleteNotification },
      { status: 200, statusText: 'Notification Rule Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete notification):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
