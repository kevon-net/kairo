import prisma from '@/libraries/prisma';
import { createClient } from '@/libraries/supabase/server';
import { CategoryGet } from '@/types/models/category';
import { SyncStatus } from '@generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();

    // // remove deleted categories
    // const deleteCategories = await prisma.category.deleteMany({
    //   where: { sync_status: SyncStatus.DELETED, profile_id: session.user?.id },
    // });

    const categoryRecords = await prisma.category.findMany({
      where: { profile_id: session.user?.id },
    });

    return NextResponse.json(
      {
        items: categoryRecords,
        // deletedItems: deleteCategories
      },
      { status: 200, statusText: 'Categories Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      categories,
      deletedIds,
    }: { categories: CategoryGet[]; deletedIds?: string[] } =
      await request.json();

    // First mark explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.category.updateMany({
        where: { id: { in: deletedIds } },
        data: {
          sync_status: SyncStatus.DELETED,
        },
      });
    }

    const updateCategories = await Promise.all(
      categories.map(async (category) => {
        const updateOperation = await prisma.category.upsert({
          where: { id: category.id },
          update: {
            title: category.title,
            color: category.color,
            sync_status: category.sync_status,
            // view: category.view,
            context: category.context,
            updated_at: new Date(category.updated_at),
          },
          create: {
            id: category.id,
            title: category.title,
            color: category.color,
            sync_status: category.sync_status || SyncStatus.SYNCED,
            // view: category.view,
            context: category.context,
            updated_at: new Date(category.updated_at),
            profile_id: category.profile_id,
          },
        });

        return updateOperation;
      })
    );

    return NextResponse.json(
      { items: updateCategories },
      { status: 200, statusText: 'Categories Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const categories: CategoryGet[] = await request.json();

    // delete categories
    const deleteCategories = await prisma.category.deleteMany({
      where: { id: { in: categories.map((c) => c.id) } },
    });

    return NextResponse.json(
      { items: deleteCategories },
      { status: 200, statusText: 'Categories Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
