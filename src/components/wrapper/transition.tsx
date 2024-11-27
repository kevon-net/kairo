'use client';

import React from 'react';

import {
  Transition as TransitionComponent,
  TransitionProps,
} from '@mantine/core';

export default function Transition({
  mounted = false,
  transition = 'fade',
  children,
  ...restProps // Gather remaining props
}: {
  mounted: boolean;
  transition?: TransitionProps['transition'];
  children: React.ReactNode;
} & Omit<TransitionProps, 'mounted' | 'transition' | 'children'>) {
  return (
    <TransitionComponent
      mounted={mounted}
      transition={transition}
      duration={250}
      timingFunction="ease"
      {...restProps} // Spread the restProps here
    >
      {(styles) => <div style={styles}>{children}</div>}
    </TransitionComponent>
  );
}
