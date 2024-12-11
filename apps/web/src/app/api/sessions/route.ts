export const dynamic = 'force-dynamic';

import prisma from '@/libraries/prisma';
import { getSession } from '@/libraries/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Sign in to continue' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    const sessionRecords = await prisma.session.findMany({
      where: { userId: session.user.id },
    });

    if (!sessionRecords || sessionRecords.length < 1) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    return NextResponse.json(
      {
        message: 'Session records retrieved successfully',
        sessions: sessionRecords,
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
