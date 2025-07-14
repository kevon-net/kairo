import React from 'react';
import { Center } from '@mantine/core';
import { SECTION_SPACING } from '@/data/constants';
import LayoutSection from '@/components/layout/section';
import LoaderMain from '@/components/common/loaders/main';

export default function Main() {
  return (
    <LayoutSection id={'loading'}>
      <Center mih={'100vh'} pb={SECTION_SPACING}>
        <LoaderMain />
      </Center>
    </LayoutSection>
  );
}
