import { contactCreate } from '@/libraries/wrappers/email/contact';
import { emailSendAuthEmailVerify } from '@/libraries/wrappers/email/send/auth/email';
import { generateOtpCode } from '@/utilities/generators/otp';
import prisma from '@/libraries/prisma';
import { hashValue } from '@/utilities/helpers/hasher';
import { generateId } from '@/utilities/generators/id';
import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@prisma/client';
import { encrypt } from '@/utilities/helpers/token';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // query database for user
    const userRecord = await prisma.user.findUnique({ where: { email } });

    if (userRecord) {
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

    const token = await encrypt({ id: tokenId, otp: otpHash, userId }, 60 * 60);

    const transactions = await prisma.$transaction(async () => {
      const createUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          password: (await hashValue(password.initial)) || null,

          profile: { create: { id: generateId(), name } },
        },
      });

      await prisma.token.deleteMany({
        where: {
          type: Type.CONFIRM_EMAIL,
          userId,
          expiresAt: { lt: new Date() },
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
        resend: {
          email: await emailSendAuthEmailVerify(otpValue.toString(), {
            to: email,
          }),
          contact: await contactCreate({
            name: `${name.first} ${name.last}`,
            email,
          }),
        },
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
