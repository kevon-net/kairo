import prisma from '@/libraries/prisma';
import { compareHashes, decrypt } from '@repo/utils/helpers';
import { generateId } from '@repo/utils/generators';
import { Status, Type } from '@repo/schemas/node_modules/@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, KEY } from '@/data/constants';
import { getExpiry } from '@/utilities/time';
import { signIn } from '@/libraries/auth';
import { SignIn } from '@/types/bodies/request';
import { IpData } from '@/types/bodies/response';
import { setGeoData } from '@/libraries/geolocation';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import { UserInfo } from '@repo/types';
import { ParsedState } from '../callback/google/route';

export async function POST(request: NextRequest) {
  try {
    const {
      provider,
      credentials,
      userInfo,
      parsed,
    }: SignIn & { userInfo: UserInfo; parsed: ParsedState } =
      await request.json();

    let userRecord = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: { profile: true, tokens: true },
    });

    if (provider == Provider.CREDENTIALS) {
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
              userRecord.tokens.find(
                (token) => token.type == Type.CONFIRM_EMAIL
              )?.token || null,
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
    } else {
      if (!userRecord) {
        userRecord = await prisma.user.create({
          data: {
            id: generateId(),
            email: credentials.email,
            verified: true,
            profile: {
              create: {
                name: userInfo.name || '',
                avatar: userInfo.picture,
              },
            },
          },
          include: { profile: true, tokens: true },
        });
      }
    }

    const expires = new Date(
      Date.now() + getExpiry(credentials.remember).millisec
    );

    const transaction = await prisma.$transaction(async () => {
      await prisma.session.deleteMany({
        where: { userId: userRecord.id, expiresAt: { lt: new Date() } },
      });

      if (userRecord.status != Status.ACTIVE) {
        await prisma.user.update({
          where: { id: userRecord.id },
          data: { status: Status.ACTIVE },
        });
      }

      if (provider != Provider.CREDENTIALS) {
        const accountRecord = await prisma.account.findUnique({
          where: {
            providerName_providerAccountId: {
              providerName: provider,
              providerAccountId: userInfo.accountId,
            },
          },
        });

        if (!accountRecord) {
          await prisma.user.update({
            where: { id: userRecord.id },
            data: {
              accounts: {
                create: {
                  id: generateId(),
                  accessToken: userInfo.accessToken,
                  providerName: provider as Provider,
                  providerAccountId: userInfo.accountId,
                  expiresAt: expires,
                },
              },
            },
          });
        }
      }

      let osCookie: string;
      let os: string;
      let geoDataCookie: string;
      let geoData: IpData;

      if (provider == Provider.CREDENTIALS) {
        osCookie = request.cookies.get(COOKIE_NAME.DEVICE.OS)?.value || '';
        os = osCookie ? JSON.parse(osCookie).os : null;
        geoDataCookie = request.cookies.get(COOKIE_NAME.GEO)?.value || '';
      } else {
        os = parsed.os;
        geoDataCookie = parsed.geo;
      }

      try {
        geoData = geoDataCookie ? await decrypt(geoDataCookie, KEY) : null;
      } catch {
        await setGeoData(request);
        const newGeoDataCookie = cookies().get(COOKIE_NAME.GEO)?.value;
        geoData = newGeoDataCookie
          ? await decrypt(newGeoDataCookie, KEY)
          : null;
      }

      const location = geoData
        ? `${geoData?.latitude}, ${geoData?.longitude}`
        : '';

      const createSession = await prisma.session.create({
        data: {
          id: generateId(),
          expiresAt: expires,
          userId: userRecord.id,
          ip: geoData?.ip || '',
          city: geoData?.city || '',
          country: geoData?.country_name || '',
          loc: location,
          os: os,
        },
      });

      return { createSession };
    });

    // Create response with explicit cookie setting
    const response = NextResponse.json(
      { message: 'User authenticated successfully', user: userRecord },
      { status: 200, statusText: 'User Authenticated' }
    );

    await signIn(
      provider,
      transaction.createSession,
      userRecord,
      credentials,
      response
    );

    return response;
  } catch (error) {
    console.error('---> route handler error (sign in):', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end' },
      { status: 500 }
    );
  }
}
