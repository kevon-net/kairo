'use client';

import { usePomo } from '@/components/contexts/pomo-cycles';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useTabAside } from '@/hooks/tab/navbar';
import { prependZeros, secToMinSec } from '@/utilities/formatters/number';
import { Status } from '@generated/prisma';
import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  Progress,
  RingProgress,
  Stack,
  Text,
  Tooltip,
  Transition,
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

export default function Live({ props }: { props?: { categoryId?: string } }) {
  const { category } = useTabAside();

  const {
    phase,
    phaseTime,
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
  } = usePomo();

  const progressValue =
    ((elapsedTime || 0) / (session?.duration || phaseTime.duration)) * 100;
  const defaultMinSec = { minutes: phaseTime.duration, seconds: '00' };
  const minSec = secToMinSec(remainingTime || defaultMinSec.minutes);

  return (
    <Stack>
      <Box mih={5}>
        <Transition mounted={!!session || completedWorkSessions > 0}>
          {(styles) => (
            <div style={styles}>
              {phase != 'longBreak' ? (
                <Group gap={'xs'} justify="center" mih={5}>
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
                <Group gap={'xs'} justify="center" mih={5}>
                  <Progress
                    value={progressValue}
                    w={96}
                    size={ICON_STROKE_WIDTH}
                    color={completedWorkSessions % 4 == 0 ? 'pri' : undefined}
                    transitionDuration={250}
                  />
                </Group>
              )}
            </div>
          )}
        </Transition>
      </Box>

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
            thickness={ICON_STROKE_WIDTH}
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

      <Stack mih={72}>
        <Group justify="center" wrap="nowrap">
          <Transition mounted={!!session || completedWorkSessions > 0}>
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
                  startPhase({
                    values: { category_id: props?.categoryId || null },
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

          <Transition mounted={!!session || completedWorkSessions > 0}>
            {(styles) => (
              <Group style={styles}>
                <Tooltip label={'Skip to next session'}>
                  <ActionIcon
                    variant={'light'}
                    color="pri.5"
                    onClick={skipPhase}
                  >
                    <IconPlayerSkipForward
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Transition>
        </Group>

        <Group justify="center" wrap="nowrap">
          <Transition mounted={completedWorkSessions > 0}>
            {(styles) => (
              <Group style={styles}>
                <Tooltip label={'Reset cycle'}>
                  <ActionIcon variant="light" color="red" onClick={resetCycle}>
                    <IconRestore size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Transition>
        </Group>
      </Stack>
    </Stack>
  );
}

const ringSize = 240;
