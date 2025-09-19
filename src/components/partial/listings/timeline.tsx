'use client';

import React from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Stack } from '@mantine/core';
import { useAppSelector } from '@/hooks/redux';

export default function Timeline() {
  const sessions = useAppSelector((state) => state.sessions.value);

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      <Stack gap={SECTION_SPACING / 2}>
        {sessions == null ? 'loading ui goes here' : 'sessions go here'}
      </Stack>
    </Container>
  );
}
