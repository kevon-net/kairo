import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SessionCreate } from '@repo/types/models';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/data/constants';
import { Status } from '@repo/schemas/node_modules/@prisma/client';
import { SessionUpdate } from '@/types/bodies/request';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionRecord = await prisma.session.findUnique({
      where: { id: params.sessionId },
    });

    if (!sessionRecord) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    if (sessionRecord.status == Status.INACTIVE) {
      await prisma.session.delete({ where: { id: params.sessionId } });

      return NextResponse.json(
        { error: 'The session was deactivated' },
        { status: 401, statusText: 'Session Inactive' }
      );
    }

    return NextResponse.json(
      { message: 'Session retrieved successfully', session: sessionRecord },
      { status: 200, statusText: 'Session Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (create session):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session: SessionCreate = await request.json();

    const sessionRecord = await prisma.session.findUnique({
      where: { id: session.id },
    });

    if (sessionRecord) {
      return NextResponse.json(
        { error: 'Session already exists' },
        { status: 409, statusText: 'Already Exists' }
      );
    }

    const createNewSession = await prisma.session.create({ data: session });

    return NextResponse.json(
      { message: 'Session created successfully', session: createNewSession },
      { status: 200, statusText: 'Session Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create session):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { session, options }: SessionUpdate = await request.json();

    const result = await prisma.$transaction(async () => {
      const deleteExpiredSessions = await prisma.session.deleteMany({
        where: {
          userId: options?.userId,
          expiresAt: { lt: new Date() },
        },
      });

      const sessionRecord = await prisma.session.findUnique({
        where: { id: params.sessionId },
      });

      return { deleteExpiredSessions, sessionRecord };
    });

    if (!result.sessionRecord) {
      if (options?.create) {
        await prisma.session.create({
          data: {
            id: session.id as string,
            expiresAt: session.expiresAt as Date,
            ip: session.ip as string,
            city: session.city as string,
            country: session.country as string,
            loc: session.loc as string,
            os: session.os as string,
            userId: options.userId,
          },
        });

        return NextResponse.json(
          { message: 'New session created' },
          { status: 200, statusText: 'Session Created' }
        );
      }

      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    await prisma.session.update({
      where: { id: params.sessionId },
      data: session,
    });

    return NextResponse.json(
      { message: 'Your session has been updated' },
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

export async function DELETE({ params }: { params: { sessionId: string } }) {
  try {
    const sessionRecord = await prisma.session.findUnique({
      where: { id: params.sessionId },
    });

    if (!sessionRecord) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    await prisma.session.delete({ where: { id: params.sessionId } });

    cookies().delete(COOKIE_NAME.SESSION);

    return NextResponse.json(
      { message: 'Your session has been deleted' },
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
