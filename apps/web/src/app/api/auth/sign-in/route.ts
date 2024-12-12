import prisma from '@/libraries/prisma';
import { compareHashes, decrypt } from '@repo/utils/helpers';
import { generateId } from '@repo/utils/generators';
import {
  Provider,
  Status,
  Type,
} from '@repo/schemas/node_modules/@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, KEY } from '@/data/constants';
import { getExpiry } from '@/utilities/time';
import { signIn } from '@/libraries/auth';
import { SignIn } from '@/types/bodies/request';
import { IpData } from '@/types/bodies/response';
import { setGeoData } from '@/libraries/geolocation';

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

      const osCookie = request.cookies.get(COOKIE_NAME.DEVICE.OS)?.value;
      const { os } = osCookie ? JSON.parse(osCookie) : null;

      const geoDataCookie = cookies().get(COOKIE_NAME.GEO)?.value;
      let geoData: IpData;

      try {
        geoData = geoDataCookie ? await decrypt(geoDataCookie, KEY) : null;
      } catch {
        await setGeoData(request);
        const newGeoDataCookie = cookies().get(COOKIE_NAME.GEO)?.value;
        geoData = newGeoDataCookie
          ? await decrypt(newGeoDataCookie, KEY)
          : null;
      }

      const createSession = await prisma.session.create({
        data: {
          id: generateId(),
          expiresAt: expires,
          userId: userRecord.id,
          ip: geoData?.ip || '',
          city: geoData?.city,
          country: geoData?.country_name,
          loc: `${geoData?.latitude}, ${geoData?.longitude}`,
          os,
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
