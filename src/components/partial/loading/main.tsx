import React from 'react';
import { Stack, Loader } from '@mantine/core';
import LayoutSection from '@/components/layout/section';
import { SECTION_SPACING } from '@/data/constants';

export default function Main() {
  return (
    <LayoutSection id={'error-404'}>
      <Stack justify="center" mih={'100vh'} pb={SECTION_SPACING}>
        <Loader />
      </Stack>
    </LayoutSection>
  );
}
