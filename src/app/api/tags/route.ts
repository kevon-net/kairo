import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { TagGet } from '@/types/models/tag';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted tags
    // const deleteTags = await prisma.reminder.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const tagRecords = await prisma.tag.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: tagRecords,
        // deletedItems: deleteTags
      },
      { status: 200, statusText: 'Tags Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tags):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { tags, deletedIds }: { tags: TagGet[]; deletedIds: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.tag.deleteMany({ where: { id: { in: deletedIds } } });
    }

    const updateTags = await Promise.all(
      tags.map(async (tag) => {
        const updateOperation = await prisma.tag.upsert({
          where: { id: tag.id },
          update: {
            title: tag.title,
            color: tag.color,
            sync_status: tag.sync_status,
            updated_at: new Date(tag.updated_at),
          },
          create: {
            id: tag.id,
            title: tag.title,
            color: tag.color,
            context: tag.context,
            sync_status: tag.sync_status || SyncStatus.SYNCED,
            created_at: new Date(tag.created_at),
            updated_at: new Date(tag.updated_at),
            profile_id: tag.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateTags },
      { status: 200, statusText: 'Tags Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tags):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tags: TagGet[] = await request.json();

    // delete tags
    const deleteTags = await prisma.tag.deleteMany({
      where: { id: { in: tags.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteTags },
      { status: 200, statusText: 'Tags Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tags):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
