import prisma from '@/libraries/prisma';
import { NextResponse } from 'next/server';
import { getSession, signOut } from '@/libraries/auth';

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Already signed out' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    // remove sessions from db
    const transactions = await prisma.$transaction(async () => {
      const sessionRecord = await prisma.session.findUnique({
        where: { id: session.id },
      });

      let deleteSession;

      if (sessionRecord) {
        deleteSession = await prisma.session.delete({
          where: { id: session.id },
        });
      }

      const deleteSessions = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          expiresAt: { lt: new Date() },
        },
      });

      return { deleteSession, deleteSessions };
    });

    await signOut();

    return NextResponse.json(
      { message: 'User signed out', sessions: transactions.deleteSession },
      { status: 200, statusText: 'Signed Out' }
    );
  } catch (error) {
    console.error('---> route handler error (sign out):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
