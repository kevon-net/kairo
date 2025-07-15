import prisma from '@/libraries/prisma';
import { SessionCreate, SessionUpdate } from '@/types/models/session';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const sessionRecord = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { category: true, task: true },
    });

    return NextResponse.json(
      { session: sessionRecord },
      { status: 200, statusText: 'Session Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get session):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session: SessionCreate = await request.json();

    const createSession = await prisma.session.create({ data: session });

    return NextResponse.json(
      { session: createSession },
      { status: 200, statusText: 'Session Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create session):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const session: SessionUpdate = await request.json();

    const updateSession = await prisma.session.update({
      where: { id: sessionId },
      data: session,
    });

    return NextResponse.json(
      { session: updateSession },
      { status: 200, statusText: 'Session Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update session):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const deleteSession = await prisma.session.delete({
      where: { id: sessionId },
    });

    return NextResponse.json(
      { session: deleteSession },
      { status: 200, statusText: 'Session Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete session):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
