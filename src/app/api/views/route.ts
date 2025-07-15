import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { ViewGet } from '@/types/models/views';
import { SyncStatus } from '@generated/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted views
    // const deleteViews = await prisma.view.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const viewRecords = await prisma.view.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: viewRecords,
        // deletedItems: deleteViews
      },
      { status: 200, statusText: 'Views Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get views):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { views, deletedIds }: { views: ViewGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.view.deleteMany({ where: { id: { in: deletedIds } } });
    }

    const updateViews = await Promise.all(
      views.map(async (view) => {
        const updateOperation = await prisma.view.upsert({
          where: { id: view.id },
          update: {
            title: view.title,
            sort_direction: view.sort_direction || null,
            sync_status: view.sync_status,
            updated_at: new Date(view.updated_at),
          },
          create: {
            id: view.id,
            title: view.title,
            sort_direction: view.sort_direction || null,
            sync_status: view.sync_status || SyncStatus.SYNCED,
            created_at: new Date(view.created_at),
            updated_at: new Date(view.updated_at),
            profile_id: view.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateViews },
      { status: 200, statusText: 'Views Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update views):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const views: ViewGet[] = await request.json();

    // delete views
    const deleteViews = await prisma.view.deleteMany({
      where: { id: { in: views.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteViews },
      { status: 200, statusText: 'Views Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update views):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
