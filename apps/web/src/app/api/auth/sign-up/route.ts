import { sendTransactionalEmailAuthVerify } from '@/libraries/wrappers/email/transactional/auth/email';
import { generateOtpCode, generateId } from '@repo/utils/generators';
import { hashValue, encrypt } from '@repo/utils/helpers';
import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@repo/schemas/node_modules/@prisma/client';
import { SignUp } from '@/types/bodies/request';
import { KEY } from '@/data/constants';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: SignUp = await request.json();

    // query database for user
    const userRecord = await prisma.user.findUnique({
      where: { email },
      include: { tokens: { where: { type: Type.CONFIRM_EMAIL } } },
    });

    if (userRecord) {
      if (userRecord.tokens.length > 1) {
        await prisma.token.deleteMany({
          where: {
            type: Type.CONFIRM_EMAIL,
            userId: userRecord.id,
            expiresAt: { lt: new Date() },
          },
        });
      }

      return NextResponse.json(
        {
          error: 'Already signed up',
          user: { id: userRecord.id, verified: userRecord.verified },
        },
        { status: 409, statusText: 'User Exists' }
      );
    }

    const userId = generateId();
    const tokenId = generateId();

    const otpValue = generateOtpCode();
    const otpHash = await hashValue(otpValue);

    const token = await encrypt(
      { id: tokenId, otp: otpHash, userId },
      KEY,
      60 * 60
    );

    const transactions = await prisma.$transaction(async () => {
      const createUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          password: (await hashValue(password.initial)) || null,

          profile: { create: { id: generateId(), name } },
        },
        include: {
          profile: true,
        },
      });

      await prisma.token.create({
        data: {
          id: tokenId,
          type: Type.CONFIRM_EMAIL,
          token: token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userId,
        },
      });

      return { createUser };
    });

    return NextResponse.json(
      {
        message: 'Your account has been created',
        user: { id: transactions.createUser.id },
        token,
        resend: await sendTransactionalEmailAuthVerify({
          otp: otpValue.toString(),
          options: {
            to: email,
          },
          userName:
            transactions.createUser.profile?.name ||
            transactions.createUser.email,
        }),
      },
      { status: 200, statusText: `Account Created` }
    );
  } catch (error) {
    console.error('---> route handler error (sign up):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
