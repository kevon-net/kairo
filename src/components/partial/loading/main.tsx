import React from 'react';
import { Loader, Center } from '@mantine/core';
import LayoutSection from '@/components/layout/section';
import { SECTION_SPACING } from '@/data/constants';

export default function Main() {
  return (
    <LayoutSection id={'error-404'}>
      <Center mih={'100vh'} pb={SECTION_SPACING}>
        <Loader />
      </Center>
    </LayoutSection>
  );
}
