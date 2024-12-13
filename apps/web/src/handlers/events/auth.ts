'use client';

import { COOKIE_NAME } from '@/data/constants';
import { Credentials } from '@repo/types';
import { setCookie } from '@repo/utils/helpers';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import { signIn as handleRequestSignIn } from '../requests/auth/sign-in';
import { signOut as handleRequestSignOut } from '../requests/auth/sign-out';

export const signIn = async (params: {
  provider: Provider;
  credentials: Credentials;
  device?: { os?: string };
}) => {
  // do something before sign in
  if (params.device?.os) {
    setCookie(
      COOKIE_NAME.DEVICE.OS,
      { os: params.device?.os },
      { expiryInSeconds: 60 }
    );
  }

  return await handleRequestSignIn({
    provider: params.provider,
    credentials: params.credentials,
  });
};

export const signOut = async () => {
  // do something before sign out

  return await handleRequestSignOut();
};
