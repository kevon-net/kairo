'use client';

import React, { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { setRedirectUrl } from '@/utilities/helpers/url';
import { Box, LoadingOverlay } from '@mantine/core';
import { AUTH_URLS } from '@/data/constants';
import { signOut } from '@/handlers/events/auth';

export function SignIn({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <span
      onClick={() =>
        router.push(
          setRedirectUrl({
            targetUrl: AUTH_URLS.SIGN_IN,
            redirectUrl: pathname,
          })
        )
      }
    >
      {children}
    </span>
  );
}

export function SignUp({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <span
      onClick={() =>
        router.push(
          setRedirectUrl({
            targetUrl: AUTH_URLS.SIGN_UP,
            redirectUrl: pathname,
          })
        )
      }
    >
      {children}
    </span>
  );
}

export function SignOut({ children }: { children: React.ReactNode }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Box
      component="span"
      pos="relative"
      onClick={async () => {
        setClicked(true);
        const { redirect } = await signOut();
        window.location.href = redirect;
      }}
    >
      <LoadingOverlay
        visible={clicked}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ size: 'xs' }}
      />
      {children}
    </Box>
  );
}
