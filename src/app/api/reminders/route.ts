import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ReminderGet } from '@/types/models/reminder';
import { createClient } from '@/libraries/supabase/server';
import { SyncStatus } from '@generated/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted reminders
    // const deleteReminders = await prisma.reminder.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const reminderRecords = await prisma.reminder.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: reminderRecords,
        // deletedItems: deleteReminders
      },
      { status: 200, statusText: 'Reminders Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get reminders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      reminders,
      deletedIds,
    }: { reminders: ReminderGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.reminder.deleteMany({ where: { id: { in: deletedIds } } });
    }

    const updateReminders = await Promise.all(
      reminders.map(async (reminder) => {
        const updateOperation = await prisma.reminder.upsert({
          where: { id: reminder.id },
          update: {
            remind_at: new Date(reminder.remind_at),
            sent: reminder.sent,
            task_id: reminder.task_id,
            sync_status: reminder.sync_status,
            updated_at: new Date(reminder.updated_at),
          },
          create: {
            id: reminder.id,
            remind_at: new Date(reminder.remind_at),
            sent: reminder.sent,
            sync_status: reminder.sync_status || SyncStatus.SYNCED,
            task_id: reminder.task_id,
            created_at: new Date(reminder.created_at),
            updated_at: new Date(reminder.updated_at),
            profile_id: reminder.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateReminders },
      { status: 200, statusText: 'Reminders Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update reminders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const reminders: ReminderGet[] = await request.json();

    // delete reminders
    const deleteReminders = await prisma.reminder.deleteMany({
      where: { id: { in: reminders.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteReminders },
      { status: 200, statusText: 'Reminders Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update reminders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
