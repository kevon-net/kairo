/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { NextResponse } from 'next/server';
import { cookieName, key } from '@/data/constants';
import { cookies } from 'next/headers';
import { sessionUpdate } from '@/handlers/requests/database/session';
import { Credentials, Session } from '@repo/types';
import { SessionGet,UserGet,ProfileGet  } from '@repo/types/models';
import { Provider } from '@prisma/client';
import { decrypt, encrypt,isProduction } from '@repo/utils/helpers';
import { getExpiry } from '@/utilities/time';

export const getSessionCookie = async (): Promise<string | null> => {
  const sessionCookieValue = cookies().get(cookieName.session)?.value;
  return sessionCookieValue || null;
};

export const getSession = async (): Promise<Session | null> => {
  const sessionCookieValue = await getSessionCookie();
  const session = !sessionCookieValue
    ? null
    : await decrypt(sessionCookieValue,key);

  return session;
};

export const signIn = async (
  provider: Provider,
  sessionObject: SessionGet,
  userObject: UserGet & { profile: ProfileGet | null },
  credentials?: Credentials
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
    },key,
    getExpiry(credentials?.remember ?? true).sec
  );

  // save session in cookie
  return cookies().set(cookieName.session, session, {
    expires: sessionObject.expiresAt,
    secure: isProduction(),
    httpOnly: true,
  });
};

export const signOut = async () => cookies().delete(cookieName.session);

export const updateSession = async (
  response: NextResponse,
  session: string
) => {
  const parsed: Session = await decrypt(session,key);
  const remember = parsed.user.remember;

  const expiry = getExpiry(remember).millisec;
  const expires = new Date(Date.now() + expiry);

  parsed.expires = expires;

  response.cookies.set({
    name: cookieName.session,
    value: await encrypt(parsed,key, getExpiry(remember).sec),
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
      headers['Cookie'] = `${cookieName.session}=${sessionCookieValue}`;
    }
  }

  return headers;
};
