'use client';

import React from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Group, Stack } from '@mantine/core';
import CardSessionTimer from '@/components/common/cards/session/timer';
import CardSessionStopwatch from '@/components/common/cards/session/stopwatch';
import { useAppSelector } from '@/hooks/redux';

export default function Home() {
  const timerMode = useAppSelector((state) => state.timerMode.value);
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
        py={SECTION_SPACING}
      >
        <Group justify="center">
          {timerMode != null && (
            <>
              {timerMode.mode == 'timer' && <CardSessionTimer />}

              {timerMode.mode == 'stopwatch' && <CardSessionStopwatch />}
            </>
          )}
        </Group>
      </Stack>
    </Container>
  );
}
