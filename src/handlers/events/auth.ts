'use client';

import { cookieName } from '@/data/constants';
import { Credentials } from '@/types/auth';
import { setCookie } from '@/utilities/helpers/cookie';
import { Provider } from '@prisma/client';
import { signIn as handleRequestSignIn } from '../requests/auth/sign-in';
import { signOut as handleRequestSignOut } from '../requests/auth/sign-out';

export const signIn = async (
  provider?: Provider,
  credentials?: Credentials,
  device?: { os?: string }
) => {
  // do something before sign in
  setCookie(
    cookieName.device.os,
    { os: device?.os },
    { sameSite: 'Strict', expiryInSeconds: 60 }
  );

  return await handleRequestSignIn({ provider, credentials });
};

export const signOut = async () => {
  // do something before sign out

  return await handleRequestSignOut();
};
