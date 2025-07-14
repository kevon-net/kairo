import prisma from '@/libraries/prisma';
import { ViewCreate, ViewUpdate } from '@/types/models/views';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;

    const viewRecord = await prisma.view.findUnique({
      where: { id: viewId },
    });

    return NextResponse.json(
      { view: viewRecord },
      { status: 200, statusText: 'View Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get view):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const view: ViewCreate = await request.json();

    const createView = await prisma.view.create({
      data: view,
    });

    return NextResponse.json(
      { view: createView },
      { status: 200, statusText: 'View Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create view):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;

    const view: ViewUpdate = await request.json();

    const updateView = await prisma.view.update({
      where: { id: viewId },
      data: view,
    });

    return NextResponse.json(
      { view: updateView },
      { status: 200, statusText: 'View Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update view):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;

    const deleteView = await prisma.view.delete({
      where: { id: viewId },
    });

    return NextResponse.json(
      { view: deleteView },
      { status: 200, statusText: 'View Rule Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete view):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
