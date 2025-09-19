'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { usePomoCycles } from '@/hooks/pomo';
import { millToMinSec, prependZeros } from '@/utilities/formatters/number';
import { Status } from '@generated/prisma';
import {
  ActionIcon,
  Box,
  Center,
  Group,
  Progress,
  RingProgress,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCircleFilled,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconPlayerStop,
  IconRestore,
} from '@tabler/icons-react';
import React from 'react';

export default function Live() {
  const {
    phase,
    completedWorkSessions,
    session,
    remainingTime,
    elapsedTime,
    startPhase,
    pauseTimer,
    resetCycle,
    resumeTimer,
    skipPhase,
    stopTimer,
  } = usePomoCycles();

  const progressValue =
    elapsedTime && session?.duration
      ? (elapsedTime / session.duration) * 100
      : 0;

  const minSec = millToMinSec(remainingTime * 1000);

  return (
    <Stack>
      {phase != 'longBreak' ? (
        <Group mt={'xl'} gap={'xs'} justify="center" mih={5}>
          <Progress
            value={
              completedWorkSessions % 4 >= 1
                ? 100
                : completedWorkSessions % 4 == 0 && phase == 'work'
                  ? progressValue
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
                : completedWorkSessions % 4 == 1 && phase == 'work'
                  ? progressValue
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
                : completedWorkSessions % 4 == 2 && phase == 'work'
                  ? progressValue
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
                : completedWorkSessions % 4 == 3 && phase == 'work'
                  ? progressValue
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
            value={progressValue}
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
            sections={[{ value: 100 - progressValue, color: 'pri.7' }]}
            transitionDuration={250}
          />
        </Center>

        <Center
          mih={ringSize}
          miw={ringSize}
          fz={'var(--mantine-h1-font-size)'}
          fw={'lighter'}
        >
          <span>
            {prependZeros(Math.floor(Number(minSec?.minutes || 0)), 2)}
          </span>
          <Text component={'span'} inherit mx={'xs'}>
            :
          </Text>
          <span>
            {prependZeros(Math.floor(Number(minSec?.seconds || 0)), 2)}
          </span>
        </Center>
      </Box>

      <Group justify="center" mt="md" wrap="nowrap">
        {!session ? (
          <Tooltip label={'Start timer'}>
            <ActionIcon variant={'light'} color="pri.5" onClick={startPhase}>
              <IconPlayerPlay size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <>
            <Tooltip label={'Skip to next session'}>
              <ActionIcon variant={'light'} color="pri.5" onClick={skipPhase}>
                <IconPlayerSkipForward
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={'Stop timer'}>
              <ActionIcon variant={'light'} color="pri.5" onClick={stopTimer}>
                <IconPlayerStop size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </>
        )}

        {session?.status !== Status.PAUSED && (
          <Tooltip label={'Pause timer'}>
            <ActionIcon
              variant={'light'}
              color="pri.5"
              onClick={pauseTimer}
              disabled={session?.status === Status.INACTIVE}
            >
              <IconPlayerPause size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )}

        {session?.status === Status.PAUSED && (
          <Tooltip label={'Resume timer'}>
            <ActionIcon variant={'light'} color="pri.5" onClick={resumeTimer}>
              <IconPlayerPlay size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )}

        {completedWorkSessions > 0 && (
          <Tooltip label={'Reset cycle'}>
            <ActionIcon variant="light" color="red" onClick={resetCycle}>
              <IconRestore size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
}

const ringSize = 240;
