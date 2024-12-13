import { getOauthToken } from '@/handlers/requests/auth/oauth';
import { AUTH_URLS, COOKIE_NAME } from '@/data/constants';
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/handlers/requests/auth/sign-in';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import { cookies } from 'next/headers';
import { UserInfo } from '@repo/types';
import { SignIn } from '@/types/bodies/request';
import { isProduction } from '@repo/utils/helpers';

export interface ParsedState {
  uuid: string;
  geo: string;
  os: string;
  redirect: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const parsed: ParsedState | null = state ? JSON.parse(state) : null;

    // Verify state to prevent CSRF
    const cookieStore = cookies();
    const uuid = cookieStore.get(COOKIE_NAME.OAUTH.UUID)?.value;

    if (!code || !parsed?.uuid || parsed.uuid !== uuid) {
      if (!code) {
        return NextResponse.redirect(
          `${AUTH_URLS.ERROR}?message=${encodeURIComponent('Authorization code is missing')}`
        );
      }

      return NextResponse.redirect(
        `${AUTH_URLS.ERROR}?message=${encodeURIComponent('Invalid request')}`
      );
    }

    const responseOauth = await getOauthToken({ code });

    if (!responseOauth.ok) {
      return NextResponse.redirect(
        `${AUTH_URLS.ERROR}?message=${encodeURIComponent('Failed to exchange tokens')}`
      );
    }

    const { access_token } = await responseOauth.json();

    // Fetch user info using access token
    const userResponse = await fetch(process.env.GOOGLE_USER_INFO_URI || '', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = await userResponse.json();

    const responseSignIn = await signIn({
      provider: Provider.GOOGLE,
      credentials: {
        email: userInfo.email,
        password: '',
        remember: true,
      },
      userInfo: {
        accessToken: access_token,
        accountId: userInfo.sub,
        name: userInfo.name,
        picture: userInfo.picture,
        email: userInfo.email,
        email_verified: userInfo.email_verified,
      },
      parsed: parsed,
    } as SignIn & { userInfo: UserInfo; parsed: ParsedState });

    // Create response with explicit cookie setting
    const response = NextResponse.redirect(parsed.redirect);

    const cookieObj: Cookie = parseCookies(
      responseSignIn.headers.get('set-cookie') || ''
    );

    // Set cookies using response.cookies method
    response.cookies.set({
      name: COOKIE_NAME.SESSION,
      value: cookieObj[COOKIE_NAME.SESSION] || '',
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax',
      expires: new Date(cookieObj['Expires']),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('---> route handler error (sign up):', error);
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent('Something went wrong on our end')}`
    );
  }
}

interface Cookie {
  [key: string]: string;
}

function parseCookies(cookieHeader: string): Cookie {
  return cookieHeader.split('; ').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=');
    cookies[name] = value;
    return cookies;
  }, {} as Cookie);
}
