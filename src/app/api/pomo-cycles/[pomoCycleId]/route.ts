import prisma from '@/libraries/prisma';
import { PomoCycleCreate, PomoCycleUpdate } from '@/types/models/pomo-cycle';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pomoCycleId: string }> }
) {
  try {
    const { pomoCycleId } = await params;

    const pomoCycleRecord = await prisma.pomoCycle.findUnique({
      where: { id: pomoCycleId },
    });

    return NextResponse.json(
      { pomoCycle: pomoCycleRecord },
      { status: 200, statusText: 'PomoCycle Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get pomo cycle):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pomoCycle: PomoCycleCreate = await request.json();

    const createPomoCycle = await prisma.pomoCycle.create({ data: pomoCycle });

    return NextResponse.json(
      { pomoCycle: createPomoCycle },
      { status: 200, statusText: 'PomoCycle Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create pomo cycle):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pomoCycleId: string }> }
) {
  try {
    const { pomoCycleId } = await params;

    const pomoCycle: PomoCycleUpdate = await request.json();

    const updatePomoCycle = await prisma.pomoCycle.update({
      where: { id: pomoCycleId },
      data: pomoCycle,
    });

    return NextResponse.json(
      { pomoCycle: updatePomoCycle },
      { status: 200, statusText: 'PomoCycle Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update pomo cycle):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pomoCycleId: string }> }
) {
  try {
    const { pomoCycleId } = await params;

    const deletePomoCycle = await prisma.pomoCycle.delete({
      where: { id: pomoCycleId },
    });

    return NextResponse.json(
      { pomoCycle: deletePomoCycle },
      { status: 200, statusText: 'PomoCycle Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete pomo cycle):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
