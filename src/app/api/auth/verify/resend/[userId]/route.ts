import { emailSendAuthEmailVerify } from '@/libraries/wrappers/email/send/auth/email';
import { generateOtpCode } from '@/utilities/generators/otp';
import prisma from '@/libraries/prisma';
import { hashValue } from '@/utilities/helpers/hasher';
import { generateId } from '@/utilities/generators/id';
import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@prisma/client';
import { decrypt, encrypt } from '@/utilities/helpers/token';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Action not allowed' },
        { status: 404, statusText: 'User Not Found' }
      );
    }

    const {
      token,
      options,
    }: {
      token: string | null;
      options?: { verified?: boolean; email?: string };
    } = await request.json();

    if (!options?.verified && userRecord.verified) {
      return NextResponse.json(
        { error: 'Account is already verified' },
        { status: 409, statusText: 'Already Verified' }
      );
    }

    const now = new Date();

    let parsed: any;

    try {
      if (!token) {
        throw new Error('Token not included');
      }

      parsed = await decrypt(token);

      const expiry = new Date(parsed.exp * 1000).getTime() - now.getTime();

      return NextResponse.json(
        { error: 'OTP already sent', otp: { expiry } },
        { status: 409, statusText: 'Already Sent' }
      );
    } catch {
      if (options?.email) {
        const userWithProvidedEmail = await prisma.user.findUnique({
          where: { email: options.email as string },
        });

        if (userWithProvidedEmail) {
          return NextResponse.json(
            { error: 'An account with that email already exists' },
            { status: 409, statusText: 'Account Exists' }
          );
        }
      }

      const tokenRecord = await prisma.token.findUnique({
        where: {
          type_userId: {
            type: Type.CONFIRM_EMAIL,
            userId: userRecord.id,
          },
        },
      });

      if (tokenRecord && tokenRecord?.expiresAt > now) {
        const expiry = tokenRecord.expiresAt.getTime() - now.getTime();

        return NextResponse.json(
          { error: 'OTP already sent', otp: { expiry } },
          { status: 409, statusText: 'Already Sent' }
        );
      }

      const tokenId = generateId();

      const otpValue = generateOtpCode();
      const otpHash = await hashValue(otpValue);

      const token = await encrypt(
        { id: tokenId, otp: otpHash, userId: userRecord.id },
        60 * 60
      );

      await prisma.$transaction(async () => {
        await prisma.token.create({
          data: {
            id: tokenId,
            token,
            type: Type.CONFIRM_EMAIL,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            userId: userRecord.id,
          },
        });

        await prisma.token.deleteMany({
          where: {
            type: Type.CONFIRM_EMAIL,
            userId: userRecord.id,
            expiresAt: { lt: new Date() },
          },
        });
      });

      return NextResponse.json(
        {
          message: 'A new OTP has been sent',
          user: { id: userRecord.id },
          token,
          resend: await emailSendAuthEmailVerify(otpValue.toString(), {
            to: options?.email || userRecord.email,
            signUp: false,
          }),
        },
        { status: 200, statusText: 'OTP Sent' }
      );
    }
  } catch (error) {
    console.error(
      '---> route handler error (resend verification code):',
      error
    );
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
