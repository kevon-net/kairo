import { baseUrl } from '@/data/constants';
import prisma from '@/libraries/prisma';

import { emailSendAuthPasswordForgot } from '@/libraries/wrappers/email/send/auth/password';
import { generateId } from '@/utilities/generators/id';
import { encrypt } from '@/utilities/helpers/token';
import { Type } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const email: string = await request.json();

    const userRecord = await prisma.user.findUnique({
      where: { email },
      include: { tokens: { where: { type: Type.PASSWORD_RESET } } },
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

    const token = await encrypt({ id, userId: userRecord.id }, 60 * 60);

    const tokens = await prisma.$transaction(async () => {
      const deleteExpired = await prisma.token.deleteMany({
        where: {
          type: Type.PASSWORD_RESET,
          userId: userRecord.id,
          expiresAt: { lt: now },
        },
      });

      const createNew = await prisma.token.create({
        data: {
          id,
          type: Type.PASSWORD_RESET,
          token: token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userId: userRecord.id,
        },
      });

      return { deleteExpired, createNew };
    });

    const otlValue = `${baseUrl}/auth/password/reset?token=${token}`;

    return NextResponse.json(
      {
        message: 'An OTL has been sent',
        token: tokens.createNew,
        resend: await emailSendAuthPasswordForgot(otlValue, userRecord.email),
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
