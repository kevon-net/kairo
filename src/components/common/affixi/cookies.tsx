'use client';

import React from 'react';

import { Affix } from '@mantine/core';

import WrapperTransition from '@/components/wrapper/transition';
import { getCookieClient } from '@/utilities/helpers/cookie-client';
import { COOKIE_NAME } from '@/data/constants';

export default function Cookies({ children }: { children: React.ReactNode }) {
  const consentCookie = getCookieClient(COOKIE_NAME.CONSENT.COOKIES);

  return (
    <Affix
      position={{
        bottom: 'var(--mantine-spacing-xl)',
        left: 'var(--mantine-spacing-xl)',
      }}
    >
      <WrapperTransition
        transition={'slide-right'}
        mounted={consentCookie == 'true' ? false : true}
      >
        {children}
      </WrapperTransition>
    </Affix>
  );
}
