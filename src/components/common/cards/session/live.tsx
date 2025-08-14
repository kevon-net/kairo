'use client';

import { POMO_SESSION_LENGTH } from '@/data/constants';
import { useFormSession } from '@/hooks/form/session';
import usePomodoro from '@/hooks/session';
import { SessionRelations } from '@/types/models/session';
import { getRegionalDate } from '@/utilities/formatters/date';
import { prependZeros } from '@/utilities/formatters/number';
import { Status } from '@generated/prisma';
import {
  Box,
  Button,
  Center,
  Group,
  RingProgress,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';

export default function Live({
  session,
}: {
  session: SessionRelations | null;
}) {
  const { submitted, createOrSelectSession, persistRuntime, finalizeAndClear } =
    useFormSession({
      defaultValues: {
        title: `${getRegionalDate(new Date()).time} - ...`,
        properties: {
          start: new Date().toISOString(),
          end: '',
          category_id: 'inbox',
          task_id: '',
        },
      },
    });

  const { minutes, seconds, state, startTimer, pauseTimer, stopTimer } =
    usePomodoro({
      durationMinutes: session?.pomo_duration ?? POMO_SESSION_LENGTH,
      onStart: async (e) => {
        await createOrSelectSession(); // ✅ follows your existing create->ClientDB path
        persistRuntime({
          status: Status.ACTIVE,
          focus_duration: e.focusDuration,
        });
      },
      onPause: (e) => {
        persistRuntime({
          status: Status.PAUSED,
          focus_duration: e.focusDuration,
        });
      },
      onStop: (e) => {
        finalizeAndClear(
          {
            status: Status.INACTIVE,
            focus_duration: e.focusDuration,
            end: e.end as any,
          },
          { stopped: true }
        );
      },
    });

  const progressValue =
    ((minutes * 60 + seconds) / (POMO_SESSION_LENGTH * 60)) * 100;

  return (
    <Stack>
      <Box pos={'relative'}>
        <Center
          pos={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{ zIndex: -1 }}
        >
          <RingProgress
            size={ringSize}
            thickness={2}
            roundCaps
            sections={[{ value: progressValue, color: 'pri.7' }]}
          />
        </Center>

        <Center
          mih={ringSize}
          miw={ringSize}
          fz={'var(--mantine-h1-font-size)'}
          fw={'lighter'}
        >
          <span>{prependZeros(minutes, 2)}</span>
          <Text component={'span'} inherit mx={'xs'}>
            :
          </Text>
          <span>{prependZeros(seconds, 2)}</span>
        </Center>
      </Box>

      <Group justify="center" mt="md" wrap="nowrap">
        {state === Status.INACTIVE ? (
          <Button
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted}
            onClick={startTimer}
          >
            Start
          </Button>
        ) : (
          <Button
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted}
            onClick={stopTimer}
          >
            Stop
          </Button>
        )}

        {state === Status.ACTIVE && (
          <Button
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted}
            onClick={pauseTimer}
          >
            Pause
          </Button>
        )}

        {state === Status.PAUSED && (
          <Button
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted}
            onClick={startTimer}
          >
            Resume
          </Button>
        )}
      </Group>
    </Stack>
  );
}

const ringSize = 240;
