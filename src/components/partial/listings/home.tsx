'use client';

import React from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Group, Stack } from '@mantine/core';
import CardSessionLive from '@/components/common/cards/session/live';

export default function Home() {
  return (
    <Container
      p={{ md: SECTION_SPACING }}
      py={SECTION_SPACING / 2}
      h={'calc(100vh - 55px)'}
    >
      <Stack
        gap={SECTION_SPACING / 2}
        h={'100%'}
        justify={'center'}
        pb={SECTION_SPACING}
      >
        <Group justify="center">
          <CardSessionLive />
        </Group>
      </Stack>
    </Container>
  );
}
