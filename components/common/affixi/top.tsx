'use client';

import React from 'react';

import { Affix, AffixBaseProps } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';

import WrapperTransition from '@/components/wrapper/transition';
import ButtonScrollTop from '../buttons/scroll-top';

export default function Top({
  position = {
    bottom: 'var(--mantine-spacing-xl)',
    right: 'var(--mantine-spacing-xl)',
  },
  ...restProps
}: { position?: AffixBaseProps['position'] } & Omit<
  AffixBaseProps,
  'position' | 'children'
>) {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={position} {...restProps}>
      <WrapperTransition transition={'slide-left'} mounted={scroll.y > 0}>
        <ButtonScrollTop onClick={() => scrollTo({ y: 0 })} />
      </WrapperTransition>
    </Affix>
  );
}
