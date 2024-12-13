import { COOKIE_NAME } from '@/data/constants';
import { generateId } from '@repo/utils/generators';
import { isProduction } from '@repo/utils/helpers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get('redirect');

  const cookieStore = cookies();
  const geo = cookieStore.get(COOKIE_NAME.GEO)?.value;
  const os = cookieStore.get(COOKIE_NAME.DEVICE.OS)?.value;

  const uuid = generateId();

  cookieStore.set(COOKIE_NAME.OAUTH.UUID, uuid || '', {
    httpOnly: true,
    secure: isProduction(),
    maxAge: 15 * 60, // 15 minutes
  });

  // Construct Google OAuth authorization URL params
  const params = new URLSearchParams({
    client_id: process.env.AUTH_GOOGLE_ID || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
    response_type: 'code',
    scope: 'openid email profile',
    state: JSON.stringify({
      uuid,
      geo: geo,
      os: os ? JSON.parse(os).os : '',
      redirect: redirect || '',
    }),
    // access_type: 'offline',
    // prompt: 'consent',
  });

  return NextResponse.redirect(
    `${process.env.GOOGLE_OAUTH_URI}?${params.toString()}`
  );
}
