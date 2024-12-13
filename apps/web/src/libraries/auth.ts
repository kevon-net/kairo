/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { NextResponse } from 'next/server';
import { COOKIE_NAME, KEY } from '@/data/constants';
import { cookies } from 'next/headers';
import { sessionUpdate } from '@/handlers/requests/database/session';
import { Credentials, Session } from '@repo/types';
import { SessionGet, UserGet, ProfileGet } from '@repo/types/models';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import { decrypt, encrypt, isProduction } from '@repo/utils/helpers';
import { getExpiry } from '@/utilities/time';

export const getSessionCookie = async (): Promise<string | null> => {
  const sessionCookieValue = cookies().get(COOKIE_NAME.SESSION)?.value;
  return sessionCookieValue || null;
};

export const getSession = async (): Promise<Session | null> => {
  const sessionCookieValue = await getSessionCookie();
  const session = !sessionCookieValue
    ? null
    : await decrypt(sessionCookieValue, KEY);

  return session;
};

export const signIn = async (
  provider: Provider = Provider.CREDENTIALS,
  sessionObject: SessionGet,
  userObject: UserGet & { profile: ProfileGet | null },
  credentials?: Credentials,
  response?: NextResponse
) => {
  const session = await encrypt(
    {
      id: sessionObject.id,
      user: {
        id: userObject.id,
        email: userObject.email,
        verified: userObject.verified,
        role: userObject.role,
        name: userObject.profile?.name,
        image: userObject.profile?.avatar,
        remember: credentials?.remember ?? true,
        withPassword: userObject.password ? true : false,
      },
      expires: sessionObject.expiresAt,
    },
    KEY,
    getExpiry(credentials?.remember ?? true).sec
  );

  if (provider != Provider.CREDENTIALS) {
    response?.cookies.set({
      name: COOKIE_NAME.SESSION,
      value: session,
      expires: sessionObject.expiresAt,
      secure: isProduction(),
      httpOnly: true,
      sameSite: 'lax',
    });
  } else {
    cookies().set(COOKIE_NAME.SESSION, session, {
      name: COOKIE_NAME.SESSION,
      value: session,
      expires: sessionObject.expiresAt,
      secure: isProduction(),
      httpOnly: true,
      sameSite: 'lax',
    });
  }
};

export const signOut = async () => cookies().delete(COOKIE_NAME.SESSION);

export const updateSession = async (
  response: NextResponse,
  session: string
) => {
  const parsed: Session = await decrypt(session, KEY);
  const remember = parsed.user.remember;

  const expiry = getExpiry(remember).millisec;
  const expires = new Date(Date.now() + expiry);

  parsed.expires = expires;

  response.cookies.set({
    name: COOKIE_NAME.SESSION,
    value: await encrypt(parsed, KEY, getExpiry(remember).sec),
    expires: expires,
    httpOnly: true,
  });

  const expiresFormer = new Date(Number(parsed.exp) * 1000);
  const expiryDifference = expires.getTime() - expiresFormer.getTime();

  if (expiryDifference > expiry / 2) {
    sessionUpdate({
      session: {
        id: parsed.id,
        ip: parsed.ip,
        os: parsed.os,
        city: parsed.city,
        country: parsed.country,
        loc: parsed.loc,
        status: parsed.status,
        expiresAt: parsed.expires,
      },
      options: { create: true, userId: parsed.user.id },
    });
  }

  return response;
};

export const authHeaders = async (headers: any) => {
  // Check if running in the client-side (browser)
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    // In server-side, manually pass the session cookie if it's available
    const sessionCookieValue = await getSessionCookie();

    if (sessionCookieValue) {
      headers['Cookie'] = `${COOKIE_NAME.SESSION}=${sessionCookieValue}`;
    }
  }

  return headers;
};
