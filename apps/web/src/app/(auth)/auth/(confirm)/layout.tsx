import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';

import { Stack } from '@mantine/core';

import appData from '@/data/app';
import { SECTION_SPACING } from '@/data/constants';

export const metadata: Metadata = {
  title: {
    default: 'Confirm',
    template: `%s - Confirm - Auth - ${appData.name.app}`,
  },
};

export default function LayoutConfirm({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutSection id={'layout-confirm'} containerized="sm">
        <Stack justify="center" mih={'100vh'} pb={SECTION_SPACING}>
          {children}
        </Stack>
      </LayoutSection>
    </LayoutBody>
  );
}
