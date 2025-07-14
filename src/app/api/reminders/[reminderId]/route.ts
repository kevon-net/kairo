import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ReminderCreate, ReminderUpdate } from '@/types/models/reminder';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await params;

    const reminderRecord = await prisma.reminder.findUnique({
      where: { id: reminderId },
    });

    return NextResponse.json(
      { reminder: reminderRecord },
      { status: 200, statusText: 'Reminder Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get reminder):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const reminder: ReminderCreate = await request.json();

    const createReminder = await prisma.reminder.create({
      data: reminder,
    });

    return NextResponse.json(
      { reminder: createReminder },
      { status: 200, statusText: 'Reminder Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create reminder):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await params;

    const reminder: ReminderUpdate = await request.json();

    const updateReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: reminder,
    });

    return NextResponse.json(
      { reminder: updateReminder },
      { status: 200, statusText: 'Reminder Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update reminder):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await params;

    const deleteReminder = await prisma.reminder.delete({
      where: { id: reminderId },
    });

    return NextResponse.json(
      { reminder: deleteReminder },
      { status: 200, statusText: 'Reminder Rule Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete reminder):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
