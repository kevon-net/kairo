'use client';

import React, { useState } from 'react';

import { Affix, AffixBaseProps } from '@mantine/core';

import WrapperTransition from '@/components/wrapper/transition';
import CardCookies from '../cards/cookies';
import { getCookie } from '@repo/utils/helpers';
import { COOKIE_NAME } from '@/data/constants';

export default function Cookies({
  position = {
    bottom: 'var(--mantine-spacing-xl)',
    left: 'var(--mantine-spacing-xl)',
  },
  ...restProps
}: { position?: AffixBaseProps['position'] } & Omit<
  AffixBaseProps,
  'position' | 'children'
>) {
  const consentCookie = getCookie(COOKIE_NAME.CONSENT.COOKIES);
  const [opened, setOpened] = useState(consentCookie == 'true' ? false : true);

  return (
    <Affix position={position} {...restProps}>
      <WrapperTransition transition={'slide-right'} mounted={opened}>
        <CardCookies close={() => setOpened(false)} />
      </WrapperTransition>
    </Affix>
  );
}
