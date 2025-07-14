import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { TaskGet, TaskRelations } from '@/types/models/task';
import { Priority, SyncStatus } from '@generated/prisma';
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
        tags: {
          where: { sync_status: SyncStatus.SYNCED },
        },
        reminders: {
          where: { sync_status: SyncStatus.SYNCED },
        },
        recurring_rule: {
          where: { sync_status: SyncStatus.SYNCED },
        },
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
            description: task.description,
            due_date: task.due_date ? new Date(task.due_date) : null,
            priority: task.priority || Priority.NOT_URGENT_UNIMPORTANT,
            sync_status: task.sync_status,
            category_id: task.category_id || null,
            updated_at: new Date(task.updated_at),
            // Handle tags
            tags: task.tags
              ? {
                  set: [], // Remove existing tag connections
                  connectOrCreate: task.tags.map((tag) => ({
                    where: { id: tag.id || '' },
                    create: {
                      id: tag.id || undefined,
                      title: tag.title,
                      color: tag.color,
                      context: tag.context,
                      profile_id: tag.profile_id,
                    },
                  })),
                }
              : undefined,
          },
          create: {
            id: task.id,
            title: task.title,
            complete: task.complete || false,
            description: task.description || '',
            due_date: task.due_date ? new Date(task.due_date) : null,
            priority: task.priority || Priority.NOT_URGENT_UNIMPORTANT,
            sync_status: task.sync_status || SyncStatus.SYNCED,
            category_id: task.category_id || null,
            updated_at: new Date(task.updated_at),
            profile_id: task.profile_id,
            // Handle tags for new tasks
            tags: task.tags
              ? {
                  connectOrCreate: task.tags.map((tag) => ({
                    where: { id: tag.id || '' },
                    create: {
                      id: tag.id || undefined,
                      title: tag.title,
                      color: tag.color,
                      context: tag.context,
                      profile_id: tag.profile_id,
                    },
                  })),
                }
              : undefined,
          },
        });

        // Now that we have the task, handle recurring rule if it exists
        let recurringRuleId: string | undefined = undefined;

        if (task.recurring_rule) {
          const recurringRule = await prisma.recurringRule.upsert({
            where: { id: task.recurring_rule.id || '' },
            create: {
              id: task.recurring_rule.id || undefined,
              frequency: task.recurring_rule.frequency || 'DAY',
              interval: task.recurring_rule.interval || 1,
              day_of_week: task.recurring_rule.day_of_week || [],
              end_date: task.recurring_rule.end_date
                ? new Date(task.recurring_rule.end_date)
                : null,
              sync_status: task.recurring_rule.sync_status || SyncStatus.SYNCED,
              profile_id: task.profile_id,
            },
            update: {
              frequency: task.recurring_rule.frequency,
              interval: task.recurring_rule.interval,
              day_of_week: task.recurring_rule.day_of_week,
              end_date: task.recurring_rule.end_date
                ? new Date(task.recurring_rule.end_date)
                : null,
              sync_status: task.recurring_rule.sync_status,
              profile_id: task.profile_id,
            },
          });

          recurringRuleId = recurringRule.id;
        }

        // Update the task with the recurring rule ID if needed
        await prisma.task.update({
          where: { id: upsertOperation.id },
          data: {
            recurring_rule_id: task.recurring_rule ? recurringRuleId : null,
          },
        });

        // Return the final task with all relationships
        return prisma.task.findUnique({
          where: { id: upsertOperation.id },
          include: {
            recurring_rule: true,
            reminders: true,
            tags: true,
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
