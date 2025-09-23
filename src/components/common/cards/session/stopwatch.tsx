'use client';

import { useSessionTimer } from '@/components/contexts/session-timer';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useTabAside } from '@/hooks/tab/navbar';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { Status } from '@generated/prisma';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Tooltip,
  Transition,
} from '@mantine/core';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
} from '@tabler/icons-react';
import React from 'react';

export default function Stopwatch({
  props,
}: {
  props?: { categoryId?: string };
}) {
  const { category } = useTabAside();

  const {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    elapsedTime,
    session,
  } = useSessionTimer();

  const hourMinSec = secToHourMinSec(elapsedTime || 0);

  return (
    <Card withBorder>
      <Stack>
        <Box pos={'relative'}>
          {category && (
            <Center
              pos={'absolute'}
              top={60}
              left={0}
              right={0}
              style={{ zIndex: -1 }}
            >
              <Badge size="xs" color={`${category.color}.6` || undefined}>
                {category.title}
              </Badge>
            </Center>
          )}

          <Center fz={'var(--mantine-h1-font-size)'} fw={'lighter'}>
            <span>
              {prependZeros(Math.floor(Number(hourMinSec?.hours || 0)), 2)}
            </span>
            <Text component={'span'} inherit mx={'xs'}>
              :
            </Text>
            <span>
              {prependZeros(Math.floor(Number(hourMinSec?.minutes || 0)), 2)}
            </span>
            <Text component={'span'} inherit mx={'xs'}>
              :
            </Text>
            <span>
              {prependZeros(Math.floor(Number(hourMinSec?.seconds || 0)), 2)}
            </span>
          </Center>
        </Box>

        <Group justify="center" wrap="nowrap">
          <Transition mounted={!!session}>
            {(styles) => (
              <Group style={styles}>
                <Tooltip label={'Stop session'}>
                  <ActionIcon
                    variant={'light'}
                    color="pri.5"
                    onClick={() => stopTimer()}
                    disabled={!session}
                  >
                    <IconPlayerStop
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Transition>

          {!session && (
            <Tooltip label={'Start session'}>
              <ActionIcon
                variant={'light'}
                color="pri.5"
                onClick={() =>
                  startTimer({
                    category_id: props?.categoryId || null,
                  })
                }
              >
                <IconPlayerPlay size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}

          {session?.status === Status.ACTIVE && (
            <Tooltip label={'Pause session'}>
              <ActionIcon variant={'light'} color="pri.5" onClick={pauseTimer}>
                <IconPlayerPause size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}

          {session?.status === Status.PAUSED && (
            <Tooltip label={'Resume session'}>
              <ActionIcon variant={'light'} color="pri.5" onClick={resumeTimer}>
                <IconPlayerPlay size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
