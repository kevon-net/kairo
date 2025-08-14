import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { SessionGet, SessionRelations } from '@/types/models/session';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted sessions
    // const deleteSessions = await prisma.session.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const sessionRecords = await prisma.session.findMany({
      where: { profile_id: session.user?.id },
      include: {
        category: true,
        task: true,
      },
    });

    return NextResponse.json(
      {
        items: sessionRecords,
        // deletedItems: deleteSessions
      },
      { status: 200, statusText: 'Sessions Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get sessions):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      sessions,
      deletedIds,
    }: { sessions: SessionRelations[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.session.deleteMany({ where: { id: { in: deletedIds } } });
    }

    const upsertSessions = await Promise.all(
      sessions.map(async (session) => {
        const now = new Date();

        // First create/update the session without relationships
        const upsertOperation = await prisma.session.upsert({
          where: { id: session.id },
          update: {
            title: session.title,
            start: new Date(session.start || now),
            end: new Date(session.end || now),
            pomo_duration: session.pomo_duration,
            focus_duration: session.focus_duration,
            sync_status: session.sync_status,
            category_id: session.category_id || null,
            updated_at: new Date(session.updated_at || now),
          },
          create: {
            id: session.id,
            title: session.title,
            start: new Date(session.start || now),
            end: session.end ? new Date(session.end) : null,
            pomo_duration: session.pomo_duration || 25,
            focus_duration: session.focus_duration || 0,
            sync_status: session.sync_status || SyncStatus.SYNCED,
            category_id: session.category_id || null,
            updated_at: new Date(session.updated_at),
            profile_id: session.profile_id,
          },
        });

        // Return the final session with all relationships
        return prisma.session.findUnique({
          where: { id: upsertOperation.id },
          include: {
            category: true,
            task: true,
          },
        });
      })
    );

    return NextResponse.json(
      {
        items: upsertSessions,
        deletedCount: deletedIds?.length ?? 0,
      },
      { status: 200, statusText: 'Sessions Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (upsert sessions):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessions: SessionGet[] = await request.json();

    // delete sessions
    const deleteSessions = await prisma.session.deleteMany({
      where: { id: { in: sessions.map((s) => s.id) } },
    });

    return NextResponse.json(
      { items: deleteSessions },
      { status: 200, statusText: 'Sessions Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update sessions):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
