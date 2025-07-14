import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { RecurringRuleGet } from '@/types/models/recurring-rule';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted rules
    // const deleteRules = await prisma.recurringRule.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const recurringRuleRecords = await prisma.recurringRule.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: recurringRuleRecords,
        // deletedItems: deleteRules
      },
      { status: 200, statusText: 'Recurring Rules Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get recurring rules):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      recurringRules,
      deletedIds,
    }: { recurringRules: RecurringRuleGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.recurringRule.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    const updateRecurringRules = await Promise.all(
      recurringRules.map(async (recurringRule) => {
        const updateOperation = await prisma.recurringRule.upsert({
          where: { id: recurringRule.id },
          update: {
            frequency: recurringRule.frequency,
            day_of_week: recurringRule.day_of_week,
            end_date: !recurringRule.end_date
              ? null
              : new Date(recurringRule.end_date),
            interval: recurringRule.interval,
            sync_status: recurringRule.sync_status,
            updated_at: new Date(recurringRule.updated_at),
          },
          create: {
            id: recurringRule.id,
            frequency: recurringRule.frequency,
            day_of_week: recurringRule.day_of_week,
            end_date: !recurringRule.end_date
              ? null
              : new Date(recurringRule.end_date),
            sync_status: recurringRule.sync_status || SyncStatus.SYNCED,
            interval: recurringRule.interval,
            created_at: new Date(recurringRule.created_at),
            updated_at: new Date(recurringRule.updated_at),
            profile_id: recurringRule.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateRecurringRules },
      { status: 200, statusText: 'recurring rules Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update recurring rules):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const rules: RecurringRuleGet[] = await request.json();

    // delete rules
    const deleteRules = await prisma.recurringRule.deleteMany({
      where: { id: { in: rules.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteRules },
      { status: 200, statusText: 'Recurring Rules Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update recurring rules):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
