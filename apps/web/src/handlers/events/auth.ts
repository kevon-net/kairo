'use client';

import { COOKIE_NAME } from '@/data/constants';
import { Credentials } from '@repo/types';
import { setCookie } from '@repo/utils/helpers';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import { signIn as handleRequestSignIn } from '../requests/auth/sign-in';
import { signOut as handleRequestSignOut } from '../requests/auth/sign-out';

export const signIn = async (
  provider?: Provider,
  credentials?: Credentials,
  device?: { os?: string }
) => {
  // do something before sign in
  setCookie(COOKIE_NAME.DEVICE.OS, { os: device?.os }, { expiryInSeconds: 60 });

  return await handleRequestSignIn({ provider, credentials });
};

export const signOut = async () => {
  // do something before sign out

  return await handleRequestSignOut();
};
