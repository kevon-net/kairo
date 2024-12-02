import prisma from '@/libraries/prisma';
import { compareHashes } from '@/utilities/helpers/hasher';
import { generateId } from '@/utilities/generators/id';
import { Provider, Status, Type } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cookieName } from '@/data/constants';
import { getExpiry } from '@/utilities/helpers/time';
import { signIn } from '@/libraries/auth';
import { SignIn } from '@/types/bodies/request';

export async function POST(request: NextRequest) {
  try {
    const { provider, credentials }: SignIn = await request.json();

    if (provider != Provider.CREDENTIALS) {
      // handle oauth
      return NextResponse.json(
        { message: 'Handle oauth' },
        { status: 200, statusText: 'Oauth' }
      );
    }

    if (!credentials) {
      return NextResponse.json(
        { error: 'Credentials must be provided' },
        { status: 406, statusText: 'Missing Credentials' }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: { profile: true, tokens: true },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404, statusText: 'Not Found' }
      );
    }

    if (!userRecord.verified) {
      return NextResponse.json(
        {
          error: 'User not verified',
          user: { id: userRecord.id },
          token:
            userRecord.tokens.find((token) => token.type == Type.CONFIRM_EMAIL)
              ?.token || null,
        },
        { status: 403, statusText: 'Not Verified' }
      );
    }

    const passwordMatches = await compareHashes(
      credentials.password,
      userRecord.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Incorrect username/password' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    const deviceGeoCookie = cookies().get(cookieName.device.geo)?.value;
    const deviceGeo = deviceGeoCookie
      ? await JSON.parse(decodeURIComponent(deviceGeoCookie))
      : null;

    const expires = new Date(
      Date.now() + getExpiry(credentials.remember).millisec
    );

    const transaction = await prisma.$transaction(async () => {
      await prisma.session.deleteMany({
        where: { userId: userRecord.id, expiresAt: { lt: new Date() } },
      });

      await prisma.user.update({
        where: { id: userRecord.id },
        data: { status: Status.ACTIVE },
      });

      const createSession = await prisma.session.create({
        data: {
          id: generateId(),
          expiresAt: expires,
          ip: deviceGeo.ip,
          city: deviceGeo.city,
          country: deviceGeo.country,
          loc: deviceGeo.loc,
          os: deviceGeo.os,
          userId: userRecord.id,
        },
      });

      return { createSession };
    });

    await signIn(provider, transaction.createSession, userRecord, credentials);

    return NextResponse.json(
      { message: 'User authenticated successfully', user: userRecord },
      { status: 200, statusText: 'User Authenticated' }
    );
  } catch (error) {
    console.error('---> route handler error (sign up):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
