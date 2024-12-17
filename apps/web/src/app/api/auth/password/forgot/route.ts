import { BASE_URL, KEY } from '@/data/constants';
import prisma from '@/libraries/prisma';

import { sendEmailTransactionalAuthPasswordForgot } from '@/libraries/wrappers/email/transactional/auth/password';
import { generateId } from '@repo/utils/generators';
import { encrypt } from '@repo/utils/helpers';
import { Type } from '@repo/schemas/node_modules/@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email }: { email: string } = await request.json();

    const userRecord = await prisma.user.findUnique({
      where: { email },
      include: {
        tokens: { where: { type: Type.PASSWORD_RESET } },
        profile: true,
      },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    const now = new Date();

    if (userRecord.tokens[0]) {
      const expired = userRecord.tokens[0].expiresAt! < now;

      if (!expired) {
        const expiry = userRecord.tokens[0].expiresAt.getTime() - now.getTime();

        return NextResponse.json(
          { error: 'OTL already sent', expiry },
          { status: 409, statusText: 'Already Sent' }
        );
      }
    }

    const id = generateId();

    const token = await encrypt({ id, userId: userRecord.id }, KEY, 60 * 60);

    const tokens = await prisma.$transaction(async () => {
      if (userRecord.tokens.length > 1) {
        await prisma.token.deleteMany({
          where: {
            type: Type.PASSWORD_RESET,
            userId: userRecord.id,
            expiresAt: { lt: now },
          },
        });
      }

      const createNew = await prisma.token.create({
        data: {
          id,
          type: Type.PASSWORD_RESET,
          token: token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userId: userRecord.id,
        },
      });

      return { createNew };
    });

    const otlValue = `${BASE_URL}/auth/password/reset?token=${token}`;

    return NextResponse.json(
      {
        message: 'An OTL has been sent',
        token: tokens.createNew,
        resend: await sendEmailTransactionalAuthPasswordForgot({
          otl: otlValue,
          options: userRecord.email,
          userName: userRecord.profile?.name || userRecord.email,
        }),
      },
      { status: 200, statusText: 'OTL Sent' }
    );
  } catch (error) {
    console.error('---> route handler error (password reset):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
