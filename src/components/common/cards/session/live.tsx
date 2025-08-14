'use client';

import { POMO_SESSION_LENGTH } from '@/data/constants';
import { useFormSession } from '@/hooks/form/session';
import { useAppSelector } from '@/hooks/redux';
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
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';

export default function Live({
  session,
}: {
  session: SessionRelations | null;
}) {
  const sessions = useAppSelector((state) => state.sessions.value);

  const currentDate = new Date();

  const { form, handleSubmit, addSessionToState, updateState, submitted } =
    useFormSession({
      defaultValues: {
        title: `${getRegionalDate(currentDate).time} - ...`,
        properties: {
          start: currentDate.toISOString(),
          end: '',
          category_id: 'inbox',
          task_id: '',
        },
      },
    });

  const { minutes, seconds, startTimer, pauseTimer, resetTimer, state } =
    usePomodoro({
      durationMinutes: session?.pomo_duration ?? POMO_SESSION_LENGTH,
      form,
      handleSubmit: handleSubmit,
      addSessionToState: addSessionToState,
      updateState: updateState,
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

      <Group justify={'center'} mt={'md'}>
        {state === Status.INACTIVE ? (
          sessions == null ? (
            <Skeleton h={40} w={100} />
          ) : (
            <Button disabled={submitted} onClick={startTimer}>
              Start
            </Button>
          )
        ) : (
          <Button disabled={submitted} onClick={resetTimer}>
            Stop
          </Button>
        )}

        {state === Status.ACTIVE && (
          <Button disabled={submitted} onClick={pauseTimer}>
            Pause
          </Button>
        )}

        {state === Status.PAUSED && (
          <Button disabled={submitted} onClick={startTimer}>
            Resume
          </Button>
        )}
      </Group>
    </Stack>
  );
}

const ringSize = 240;
