import prisma from '@/libraries/prisma';
import { compareHashes } from '@/utilities/helpers/hasher';
import { decrypt } from '@/utilities/helpers/token';
import { Type } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { otp, token }: { otp: string; token: string } = await request.json();

    let parsed: any;

    try {
      parsed = await decrypt(token);
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

    const userRecord = await prisma.user.findUnique({
      where: { id: parsed.userId },
      include: { tokens: true },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Action not allowed' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    if (userRecord.verified) {
      return NextResponse.json(
        { error: 'Account is already verified' },
        { status: 409, statusText: 'Already Verified' }
      );
    }

    const match = await compareHashes(otp, parsed.otp);

    if (!match) {
      return NextResponse.json(
        { error: "You've entered the wrong OTP" },
        { status: 401, statusText: 'Invalid OTP' }
      );
    }

    await prisma.$transaction(async () => {
      await prisma.user.update({
        where: { id: parsed.userId },
        data: { verified: true },
      });

      if (userRecord.tokens.length > 0) {
        await prisma.token.delete({ where: { id: parsed.id } });

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
