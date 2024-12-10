'use client';

import React from 'react';

import { Affix, AffixBaseProps } from '@mantine/core';
import { useHeadroom, useWindowScroll } from '@mantine/hooks';

import WrapperTransition from '@/components/wrapper/transition';
import NavbarMain from '@/components/layout/navbars/main';
import UnderlayGlass from '../underlays/glass';

export default function Navbar({
  position = { left: 0, top: 0, right: 0 },
  ...restProps
}: { position?: AffixBaseProps['position'] } & Omit<
  AffixBaseProps,
  'position' | 'children'
>) {
  const [scroll] = useWindowScroll();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <Affix position={position} {...restProps}>
      <WrapperTransition
        transition={'slide-down'}
        mounted={scroll.y > 120 && pinned}
      >
        <UnderlayGlass>
          <NavbarMain />
        </UnderlayGlass>
      </WrapperTransition>
    </Affix>
  );
}
