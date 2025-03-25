'use client';

import React from 'react';
import { Affix } from '@mantine/core';
import { useHeadroom, useWindowScroll } from '@mantine/hooks';
import WrapperTransition from '@/components/wrapper/transition';
import WrapperUnderlayGlassmorphism from '@/components/wrapper/underlays/glassmorphism';

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [scroll] = useWindowScroll();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <Affix position={{ left: 0, top: 0, right: 0 }}>
      <WrapperTransition
        transition={'slide-down'}
        mounted={scroll.y > 120 && pinned}
      >
        <WrapperUnderlayGlassmorphism>{children}</WrapperUnderlayGlassmorphism>
      </WrapperTransition>
    </Affix>
  );
}
