import { getSession } from '@/libraries/auth';
import prisma from '@/libraries/prisma';
import { sendEmailTransactionalOnboard } from '@/libraries/wrappers/email/transactional/on-board';
import { compareHashes, decrypt } from '@repo/utils/helpers';
import { Type } from '@repo/schemas/node_modules/@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { contactCreate } from '@/libraries/wrappers/email/contact';
import { Verify } from '@/types/bodies/request';
import { KEY } from '@/data/constants';

export async function POST(request: NextRequest) {
  try {
    const { otp, token, options }: Verify = await request.json();

    let parsed: any;
    let tokenDatabase: any;

    let userRecord = !options?.userId
      ? null
      : await prisma.user.findUnique({
          where: { id: options?.userId },
          include: { tokens: true, profile: true },
        });

    if (
      options?.userId &&
      !userRecord?.tokens.find((t) => t.type == Type.CONFIRM_EMAIL)
    ) {
      return NextResponse.json(
        { error: 'Please request another OTP' },
        { status: 404, statusText: 'OTP Not Found' }
      );
    }

    if (!token) {
      const session = await getSession();

      tokenDatabase = !session
        ? null
        : await prisma.token.findUnique({
            where: {
              type_userId: {
                type: Type.CONFIRM_EMAIL,
                userId: session?.user.id,
              },
            },
          });
    }

    try {
      if (token) {
        parsed = await decrypt(token, KEY);
      } else if (tokenDatabase) {
        parsed = await decrypt(tokenDatabase.token, KEY);
      }

      const tokenRecord = await prisma.token.findUnique({
        where: { id: parsed.id },
      });

      if (!tokenRecord) {
        return NextResponse.json(
          { error: 'OTP already used' },
          { status: 403, statusText: 'Invalid OTP' }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'The link is broken, expired or already used' },
        { status: 409, statusText: 'Invalid Link' }
      );
    }

    userRecord =
      userRecord ||
      (await prisma.user.findUnique({
        where: { id: parsed.userId },
        include: {
          tokens: { where: { type: Type.CONFIRM_EMAIL } },
          profile: true,
        },
      }));

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Action not allowed' },
        { status: 404, statusText: 'User Not Found' }
      );
    }

    if (!options?.verified && userRecord.verified) {
      return NextResponse.json(
        { error: 'Account is already verified' },
        { status: 409, statusText: 'Already Verified' }
      );
    }

    const match = await compareHashes(otp, parsed.otp);

    if (!match) {
      return NextResponse.json(
        { error: "You've entered the wrong OTP" },
        { status: 403, statusText: 'Invalid OTP' }
      );
    }

    if (!userRecord.verified) {
      await contactCreate({
        params: {
          name:
            userRecord.profile?.name != null
              ? userRecord.profile?.name
              : undefined,
          email: userRecord.email,
        },
      });

      await sendEmailTransactionalOnboard({
        to: userRecord.email,
        userName: userRecord.profile?.name || userRecord.email,
      });
    }

    await prisma.$transaction(async () => {
      await prisma.user.update({
        where: { id: parsed.userId },
        data: { verified: true },
      });

      await prisma.token.delete({ where: { id: parsed.id } });

      if (userRecord.tokens.length > 1) {
        await prisma.token.deleteMany({
          where: {
            type: Type.CONFIRM_EMAIL,
            userId: parsed.userId,
            expiresAt: { lt: new Date() },
          },
        });
      }
    });

    return NextResponse.json(
      { message: 'You can now sign in' },
      { status: 200, statusText: 'Account Verified' }
    );
  } catch (error) {
    console.error('---> route handler error (verify):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
