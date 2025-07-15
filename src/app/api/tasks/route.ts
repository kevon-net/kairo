import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { TaskGet, TaskRelations } from '@/types/models/task';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted tasks
    // const deleteTasks = await prisma.task.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const taskRecords = await prisma.task.findMany({
      where: { profile_id: session.user?.id },
      include: {
        category: true,
        sessions: true,
      },
    });

    return NextResponse.json(
      {
        items: taskRecords,
        // deletedItems: deleteTasks
      },
      { status: 200, statusText: 'Tasks Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tasks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      tasks,
      deletedIds,
    }: { tasks: TaskRelations[]; deletedIds?: string[] } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.task.deleteMany({ where: { id: { in: deletedIds } } });
    }

    const upsertTasks = await Promise.all(
      tasks.map(async (task) => {
        // First create/update the task without relationships
        const upsertOperation = await prisma.task.upsert({
          where: { id: task.id },
          update: {
            title: task.title,
            complete: task.complete,
            sync_status: task.sync_status,
            category_id: task.category_id || null,
            updated_at: new Date(task.updated_at),
          },
          create: {
            id: task.id,
            title: task.title,
            complete: task.complete || false,
            sync_status: task.sync_status || SyncStatus.SYNCED,
            category_id: task.category_id || null,
            updated_at: new Date(task.updated_at),
            profile_id: task.profile_id,
          },
        });

        // Return the final task with all relationships
        return prisma.task.findUnique({
          where: { id: upsertOperation.id },
          include: {
            category: true,
            sessions: true,
          },
        });
      })
    );

    return NextResponse.json(
      {
        items: upsertTasks,
        deletedCount: deletedIds?.length ?? 0,
      },
      { status: 200, statusText: 'Tasks Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (upsert tasks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tasks: TaskGet[] = await request.json();

    // delete tasks
    const deleteTasks = await prisma.task.deleteMany({
      where: { id: { in: tasks.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteTasks },
      { status: 200, statusText: 'Tasks Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tasks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
