import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted pomo cycles
    // const deletePomoCycles = await prisma.pomoCycle.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const pomoCycleRecords = await prisma.pomoCycle.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: pomoCycleRecords,
        // deletedItems: deletePomoCycles
      },
      { status: 200, statusText: 'PomoCycles Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get pomo cycles):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      pomoCycles,
      deletedIds,
    }: { pomoCycles: PomoCycleGet[]; deletedIds?: string[] } =
      await request.json();

    // First mark explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.pomoCycle.updateMany({
        where: { id: { in: deletedIds } },
        data: {
          sync_status: SyncStatus.DELETED,
        },
      });
    }

    const updatePomoCycles = await Promise.all(
      pomoCycles.map(async (pomoCycle) => {
        const now = new Date();

        const updateOperation = await prisma.pomoCycle.upsert({
          where: { id: pomoCycle.id },
          update: {
            current_session_id: pomoCycle.current_session_id,
            profile_id: pomoCycle.profile_id,
            status: pomoCycle.status,
            sync_status: pomoCycle.sync_status,
            updated_at: new Date(pomoCycle.updated_at || now),
          },
          create: {
            id: pomoCycle.id,
            current_session_id: pomoCycle.current_session_id,
            profile_id: pomoCycle.profile_id,
            status: pomoCycle.status,
            sync_status: pomoCycle.sync_status || SyncStatus.SYNCED,
            created_at: new Date(pomoCycle.created_at || now),
            updated_at: new Date(pomoCycle.updated_at || now),
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updatePomoCycles },
      { status: 200, statusText: 'PomoCycles Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update pomo cycles):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pomoCycles: PomoCycleGet[] = await request.json();

    // delete pomo cycles
    const deletePomoCycles = await prisma.pomoCycle.deleteMany({
      where: { id: { in: pomoCycles.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deletePomoCycles },
      { status: 200, statusText: 'PomoCycles Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update pomo cycles):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
