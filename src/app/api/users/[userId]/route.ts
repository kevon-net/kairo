import prisma from '@/libraries/prisma';
import { generateId } from '@/utilities/generators/id';
import { NextRequest, NextResponse } from 'next/server';
import { compareHashes, hashValue } from '@/utilities/helpers/hasher';
import { UserCreate, UserUpdate } from '@/types/models/user';
import { getSession } from '@/libraries/auth';
import { Type } from '@prisma/client';
import { decrypt, encrypt } from '@/utilities/helpers/token';
import { getExpiry } from '@/utilities/helpers/time';
import { cookies } from 'next/headers';
import { cookieName } from '@/data/constants';
import { emailSendAuthPasswordChanged } from '@/libraries/wrappers/email/send/auth/password';
import { emailSendAuthEmailChanged } from '@/libraries/wrappers/email/send/auth/email';

export async function POST(request: NextRequest) {
  try {
    const user: UserCreate = await request.json();

    const userRecord = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (userRecord) {
      return NextResponse.json(
        { error: 'User already exists', user: userRecord },
        { status: 409, statusText: 'Already Exists' }
      );
    }

    const createUser = await prisma.user.create({
      data: { id: generateId(), ...user },
    });

    return NextResponse.json(
      { message: 'User created successfully', user: createUser },
      { status: 200, statusText: 'User Created' }
    );
  } catch (error) {
    console.error('---> route handler error (create user):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getSession();

    const {
      user,
      options,
    }: {
      user: UserUpdate;
      options?: { password?: string; token?: string; email?: string };
    } = await request.json();

    if (!session && !options?.token) {
      return NextResponse.json(
        { error: 'Sign in to continue' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: params.userId },
      include: { tokens: { where: { type: Type.PASSWORD_RESET } } },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    if (!userRecord.verified) {
      return NextResponse.json(
        { error: 'User not verified' },
        { status: 403, statusText: 'Not Veried' }
      );
    }

    let parsed: any;

    if (options?.password) {
      if (options.token) {
        try {
          parsed = await decrypt(options.token);

          const tokenExists = await prisma.token.findUnique({
            where: { id: parsed.id },
          });

          if (!tokenExists) throw new Error('Not Found');
        } catch {
          return NextResponse.json(
            { error: 'Link is broken, expired or already used' },
            { status: 403, statusText: 'Invalid Link' }
          );
        }
      }

      if (options.password != 'update') {
        if (options.password != 'reset') {
          const passwordMatch = await compareHashes(
            options.password,
            userRecord.password
          );

          if (!passwordMatch) {
            return NextResponse.json(
              { error: "You've entered the wrong password" },
              { status: 403, statusText: 'Wrong Password' }
            );
          }
        }

        const passwordSame = await compareHashes(
          user.password as string,
          userRecord.password
        );

        if (passwordSame) {
          return NextResponse.json(
            { error: 'Password already used' },
            { status: 409, statusText: 'Password Used' }
          );
        }
      }

      if (session && !session.user.withPassword) {
        const sessionToken = await encrypt(
          { ...session, user: { ...session.user, withPassword: true } },
          getExpiry(session.user.remember).sec
        );

        cookies().set(cookieName.session, sessionToken, {
          expires: new Date(session.expires),
          httpOnly: true,
        });
      }

      await prisma.$transaction(async () => {
        await prisma.user.update({
          where: { id: params.userId },
          data: { password: await hashValue(user.password as string) },
        });

        if (options.token && userRecord.tokens.length > 0) {
          await prisma.token.delete({ where: { id: parsed.id } });

          await prisma.token.deleteMany({
            where: {
              type: Type.PASSWORD_RESET,
              userId: userRecord.id,
              expiresAt: { lt: new Date() },
            },
          });
        }
      });

      return NextResponse.json(
        {
          message: 'Password changed successfully',
          resend: await emailSendAuthPasswordChanged(userRecord.email),
        },
        { status: 200, statusText: 'Password Changed' }
      );
    }

    if (options?.email && session) {
      const sessionToken = await encrypt(
        { ...session, user: { ...session.user, email: user.email } },
        getExpiry(session.user.remember).sec
      );

      cookies().set(cookieName.session, sessionToken, {
        expires: new Date(session.expires),
        httpOnly: true,
      });
    }

    await prisma.user.update({ where: { id: params.userId }, data: user });

    return NextResponse.json(
      {
        message: `Your ${options?.email ? 'email has' : 'details have'} been updated`,
        resend: !options?.email
          ? undefined
          : await emailSendAuthEmailChanged(user.email as string),
      },
      {
        status: 200,
        statusText: `${options?.email ? 'Email' : 'User'} Updated`,
      }
    );
  } catch (error) {
    console.error('---> route handler error (update user):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Sign in to continue' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    const { password }: { password: string | null } = await request.json();

    const passwordMatch =
      (!password && !userRecord.password) ||
      (await compareHashes(password!, userRecord.password));

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "You've entered the wrong password" },
        { status: 403, statusText: 'Wrong Password' }
      );
    }

    await prisma.user.delete({ where: { id: params.userId } });

    return NextResponse.json(
      { message: 'Your account has been deleted' },
      { status: 200, statusText: 'Account Deleted' }
    );
  } catch (error) {
    console.error('---> route handler error (delete user):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
