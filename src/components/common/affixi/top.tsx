'use client';

import React from 'react';
import { ActionIcon, Affix } from '@mantine/core';
import { useHeadroom, useWindowScroll } from '@mantine/hooks';
import WrapperTransition from '@/components/wrapper/transition';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { IconChevronUp } from '@tabler/icons-react';

export default function Top() {
  const [scroll, scrollTo] = useWindowScroll();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <Affix
      position={{
        bottom: 'var(--mantine-spacing-xl)',
        right: 'var(--mantine-spacing-xl)',
      }}
    >
      <WrapperTransition
        transition={'slide-left'}
        mounted={scroll.y > 0 && !pinned}
      >
        <ActionIcon size={ICON_WRAPPER_SIZE} onClick={() => scrollTo({ y: 0 })}>
          <IconChevronUp size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </WrapperTransition>
    </Affix>
  );
}
