import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';
import { Stack } from '@mantine/core';
import { SECTION_SPACING } from '@/data/constants';
import { appName } from '@/data/app';

export const metadata: Metadata = {
  title: {
    default: 'Confirm',
    template: `%s - Confirm - Auth - ${appName}`,
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
