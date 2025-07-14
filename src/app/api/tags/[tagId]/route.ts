import prisma from '@/libraries/prisma';
import { TagCreate, TagUpdate } from '@/types/models/tag';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;

    const tagRecord = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    return NextResponse.json(
      { tag: tagRecord },
      { status: 200, statusText: 'Tag Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tag):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tag: TagCreate = await request.json();

    const createTag = await prisma.tag.create({ data: tag });

    return NextResponse.json(
      { tag: createTag },
      { status: 200, statusText: 'Tag Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create tag):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;

    const tag: TagUpdate = await request.json();

    const updateTag = await prisma.tag.update({
      where: { id: tagId },
      data: tag,
    });

    return NextResponse.json(
      { tag: updateTag },
      { status: 200, statusText: 'Tag Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tag):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;

    const deleteTag = await prisma.tag.delete({
      where: { id: tagId },
    });

    return NextResponse.json(
      { tag: deleteTag },
      { status: 200, statusText: 'Tag Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete tag):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
