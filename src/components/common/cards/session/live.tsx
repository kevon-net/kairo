'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  POMO_BREAK_LENGTH,
  POMO_SESSION_LENGTH,
} from '@/data/constants';
import { useFormSession } from '@/hooks/form/session';
import { usePomodoroCycle } from '@/hooks/session';
import { getRegionalDate } from '@/utilities/formatters/date';
import { prependZeros } from '@/utilities/formatters/number';
import { Status } from '@generated/prisma';
import {
  Box,
  Button,
  Center,
  Group,
  Progress,
  RingProgress,
  Stack,
  Text,
} from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import React from 'react';

export default function Live() {
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

  const {
    minutes,
    seconds,
    state,
    mode,
    completedWorkSessions,
    startTimer,
    pauseTimer,
    stopTimer,
  } = usePomodoroCycle({
    workMinutes: POMO_SESSION_LENGTH,
    shortBreakMinutes: POMO_BREAK_LENGTH,
    longBreakMinutes: POMO_BREAK_LENGTH * 3,
    onWorkStart: async (e) => {
      await createOrSelectSession();
      persistRuntime({
        status: Status.ACTIVE,
        focus_duration: e.focusDuration,
      });
    },
    onWorkStop: (e) => {
      finalizeAndClear(
        {
          status: Status.INACTIVE,
          focus_duration: e.focusDuration,
          end: e.end as any,
        },
        { stopped: true }
      );
    },
    onBreakStart: () => {
      // optional: show a "Break started" toast
    },
    onBreakStop: () => {
      // optional: show "Break ended, next Pomodoro starting"
    },
  });

  const progressValue =
    ((minutes * 60 + seconds) /
      ((mode == 'work'
        ? POMO_SESSION_LENGTH
        : mode == 'shortBreak'
          ? POMO_BREAK_LENGTH
          : POMO_BREAK_LENGTH * 3) *
        60)) *
    100;

  return (
    <Stack>
      {mode != 'longBreak' ? (
        <Group mt={'xl'} gap={'xs'} justify="center" mih={5}>
          <Progress
            value={
              completedWorkSessions % 4 >= 1
                ? 100
                : completedWorkSessions % 4 == 0 && mode == 'work'
                  ? 100 - progressValue
                  : 0
            }
            w={24}
            size={ICON_STROKE_WIDTH}
            color={completedWorkSessions % 4 > 0 ? 'pri' : undefined}
            transitionDuration={250}
          />

          <IconCircleFilled
            size={ICON_SIZE / 4}
            color={
              completedWorkSessions % 4 >= 1
                ? 'var(--mantine-color-pri-5)'
                : 'var(--mantine-color-default-border)'
            }
          />

          <Progress
            value={
              completedWorkSessions % 4 >= 2
                ? 100
                : completedWorkSessions % 4 == 1 && mode == 'work'
                  ? 100 - progressValue
                  : 0
            }
            w={24}
            size={ICON_STROKE_WIDTH}
            color={completedWorkSessions % 4 > 1 ? 'pri' : undefined}
            transitionDuration={250}
          />

          <IconCircleFilled
            size={ICON_SIZE / 4}
            color={
              completedWorkSessions % 4 >= 2
                ? 'var(--mantine-color-pri-5)'
                : 'var(--mantine-color-default-border)'
            }
          />

          <Progress
            value={
              completedWorkSessions % 4 >= 3
                ? 100
                : completedWorkSessions % 4 == 2 && mode == 'work'
                  ? 100 - progressValue
                  : 0
            }
            w={24}
            size={ICON_STROKE_WIDTH}
            color={completedWorkSessions % 4 > 2 ? 'pri' : undefined}
            transitionDuration={250}
          />

          <IconCircleFilled
            size={ICON_SIZE / 4}
            color={
              completedWorkSessions % 4 >= 3
                ? 'var(--mantine-color-pri-5)'
                : 'var(--mantine-color-default-border)'
            }
          />

          <Progress
            value={
              completedWorkSessions % 4 >= 4
                ? 100
                : completedWorkSessions % 4 == 3 && mode == 'work'
                  ? 100 - progressValue
                  : 0
            }
            w={24}
            size={ICON_STROKE_WIDTH}
            color={completedWorkSessions % 4 > 3 ? 'pri' : undefined}
            transitionDuration={250}
          />
        </Group>
      ) : (
        <Group mt={'xl'} gap={'xs'} justify="center" mih={5}>
          <Progress
            value={100 - progressValue}
            w={96}
            size={ICON_STROKE_WIDTH}
            color={completedWorkSessions % 4 == 0 ? 'pri' : undefined}
            transitionDuration={250}
          />
        </Group>
      )}

      <Box pos={'relative'} mt={'md'}>
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
            transitionDuration={250}
          />
        </Center>

        <Center
          mih={ringSize}
          miw={ringSize}
          fz={'var(--mantine-h1-font-size)'}
          fw={'lighter'}
        >
          <span>{prependZeros(Math.floor(minutes), 2)}</span>
          <Text component={'span'} inherit mx={'xs'}>
            :
          </Text>
          <span>{prependZeros(Math.floor(seconds), 2)}</span>
        </Center>
      </Box>

      <Group justify="center" mt="md" wrap="nowrap">
        {state === Status.INACTIVE ? (
          <Button
            variant={'light'}
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
            variant={'light'}
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted}
            onClick={() => stopTimer('manual')}
          >
            Stop
          </Button>
        )}

        {state !== Status.PAUSED && (
          <Button
            variant={'light'}
            color="pri.5"
            w={'50%'}
            size="xs"
            disabled={submitted || state === Status.INACTIVE}
            onClick={pauseTimer}
          >
            Pause
          </Button>
        )}

        {state === Status.PAUSED && (
          <Button
            variant={'light'}
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
