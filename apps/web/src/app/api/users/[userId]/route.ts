import prisma from '@/libraries/prisma';
import { generateId } from '@repo/utils/generators';
import {
  compareHashes,
  hashValue,
  decrypt,
  encrypt,
} from '@repo/utils/helpers';
import { getExpiry } from '@/utilities/time';
import { NextRequest, NextResponse } from 'next/server';
import { UserCreate } from '@repo/types/models';
import { getSession } from '@/libraries/auth';
import { Status, Type } from '@repo/schemas/node_modules/@prisma/client';
import { cookies } from 'next/headers';
import { BASE_URL, COOKIE_NAME, KEY } from '@/data/constants';
import { sendEmailTransactionalAuthPasswordChanged } from '@/libraries/wrappers/email/transactional/auth/password';
import { sendEmailTransactionalAuthEmailChanged } from '@/libraries/wrappers/email/transactional/auth/email';
import { sendEmailTransactionalOffboardConfirm } from '@/libraries/wrappers/email/transactional/off-board';
import { UserUpdate, UserDelete } from '@/types/bodies/request';

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

    const { user, options }: UserUpdate = await request.json();

    if (!session && !options?.token) {
      return NextResponse.json(
        { error: 'Sign in to continue' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: params.userId },
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
          parsed = await decrypt(options.token, KEY);

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
          KEY,
          getExpiry(session.user.remember).sec
        );

        cookies().set(COOKIE_NAME.SESSION, sessionToken, {
          expires: new Date(session.expires),
          httpOnly: true,
        });
      }

      await prisma.$transaction(async () => {
        await prisma.user.update({
          where: { id: params.userId },
          data: { password: await hashValue(user.password as string) },
        });

        await prisma.token.delete({ where: { id: parsed.id } });

        if (options.token && userRecord.tokens.length > 1) {
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
          resend: await sendEmailTransactionalAuthPasswordChanged({
            options: userRecord.email,
            userName: userRecord.profile?.name || userRecord.email,
          }),
        },
        { status: 200, statusText: 'Password Changed' }
      );
    }

    if (options?.email && session) {
      const sessionToken = await encrypt(
        { ...session, user: { ...session.user, email: user.email } },
        KEY,
        getExpiry(session.user.remember).sec
      );

      cookies().set(COOKIE_NAME.SESSION, sessionToken, {
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
          : await sendEmailTransactionalAuthEmailChanged({
              options: user.email as string,
              userName: userRecord.profile?.name || userRecord.email,
            }),
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
    const userRecord = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        tokens: { where: { type: Type.DELETE_ACCOUNT } },
        profile: true,
      },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    const { password, options }: UserDelete = await request.json();

    let tokenRecordExpired: boolean | null = null;

    if (password || options?.trigger) {
      if (userRecord.status == Status.INACTIVE) {
        return NextResponse.json(
          { message: 'The request is already confirmed' },
          { status: 200, statusText: 'Already Confirmed' }
        );
      }

      // check if token is expired
      if (userRecord.tokens[0] && userRecord.tokens[0].expiresAt < new Date()) {
        tokenRecordExpired = true;

        return NextResponse.json(
          { error: 'The link is expired' },
          { status: 409, statusText: 'Invalid Link' }
        );
      }
    }

    // if password is provided then it's a delete request
    if (password) {
      const passwordMatch =
        (!password && !userRecord.password) ||
        (await compareHashes(password!, userRecord.password));

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "You've entered the wrong password" },
          { status: 403, statusText: 'Wrong Password' }
        );
      }

      if (userRecord.tokens[0] && !tokenRecordExpired) {
        return NextResponse.json(
          {
            error: 'A confirmation email has already been sent',
            expiry:
              userRecord.tokens[0].expiresAt.getTime() - new Date().getTime(),
          },
          { status: 409, statusText: 'Already Sent' }
        );
      }

      const tokenId = generateId();

      // create token
      const token = await encrypt(
        { id: tokenId, userId: userRecord.id },
        KEY,
        60 * 60
      );

      // add token to database
      await prisma.token.create({
        data: {
          id: tokenId,
          token,
          type: Type.DELETE_ACCOUNT,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userId: userRecord.id,
        },
      });

      // create link
      const link = `${BASE_URL}/confirm/delete-account?token=${token}`;

      // send confirmation email containing link
      await sendEmailTransactionalOffboardConfirm({
        to: userRecord.email,
        link,
        userName: userRecord.profile?.name || userRecord.email,
      });

      return NextResponse.json(
        { message: 'An email to confirm deletion has been sent' },
        { status: 200, statusText: 'Confirmation Email Sent' }
      );
    }

    if (options?.trigger) {
      if (userRecord.tokens[0]) {
        // check if token is expired
        if (tokenRecordExpired) {
          return NextResponse.json(
            { error: 'The link is expired' },
            { status: 409, statusText: 'Invalid Link' }
          );
        }

        await prisma.$transaction(async () => {
          // if user is active, deactivate (and related records visible to other users)
          if (userRecord.status != Status.INACTIVE) {
            await prisma.user.update({
              where: { id: params.userId },
              data: {
                status: Status.INACTIVE,
              },
            });
          }

          // delete used token
          await prisma.token.delete({
            where: {
              type_userId: { type: Type.DELETE_ACCOUNT, userId: params.userId },
            },
          });

          if (userRecord.tokens.length > 1) {
            await prisma.token.deleteMany({
              where: {
                type: Type.DELETE_ACCOUNT,
                userId: params.userId,
                expiresAt: { lt: new Date() },
              },
            });
          }
        });

        return NextResponse.json(
          { message: 'Your account is now marked for deletion' },
          { status: 200, statusText: 'Request Confirmed' }
        );
      }

      return NextResponse.json(
        { error: 'The link is already used' },
        { status: 404, statusText: 'Not Found' }
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
