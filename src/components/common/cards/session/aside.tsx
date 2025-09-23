import React, { useEffect, useState } from 'react';
import { Button, Group, Stack, Text, Title, Tooltip } from '@mantine/core';
import { SessionGet } from '@/types/models/session';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { useTabAside } from '@/hooks/tab/navbar';
import { BadgeComponent } from './main';
import { IconCircleFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { useRouter } from 'next/navigation';
import { useSessionTimer } from '@/components/contexts/session-timer';
import { useAppSelector } from '@/hooks/redux';
import { SessionType } from '@generated/prisma';

export default function Aside({ item }: { item: SessionGet }) {
  const router = useRouter();

  const { category, categories, tasks } = useTabAside();

  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { session: sessionPomo, startPhase } = usePomo();
  const { session: sessionStopwatch, startTimer } = useSessionTimer();

  const selectedCategory =
    category || categories?.find((c) => c.id == item.category_id);
  const selectedTask = tasks?.find((t) => t.id == item.task_id);

  const [elapsedTime, setElapsedTime] = useState(item.elapsed);

  const hourMinSec = secToHourMinSec(elapsedTime);

  useEffect(() => {
    if (timerMode == null) return;
    if (timerMode.mode == 'stopwatch') return;

    if (sessionPomo && sessionPomo.id == item.id)
      setElapsedTime(sessionPomo.elapsed || 0);
  }, [sessionPomo]);

  useEffect(() => {
    if (timerMode == null) return;
    if (timerMode.mode == 'timer') return;

    if (sessionStopwatch && sessionStopwatch.id == item.id)
      setElapsedTime(sessionStopwatch.elapsed || 0);
  }, [sessionStopwatch]);

  const duration = (
    <Text inherit c={'dimmed'} fz={'xs'} ta={'end'}>
      {prependZeros(Number(hourMinSec?.hours || 0), 2)}:
      {prependZeros(Number(hourMinSec?.minutes || 0), 2)}:
      {prependZeros(Number(hourMinSec?.seconds || 0), 2)}
    </Text>
  );

  return (
    <Stack gap={5}>
      <Group justify="space-between" mih={24.8}>
        <Group gap={'xs'}>
          {!category && item.category_id && (
            <IconCircleFilled
              size={ICON_SIZE / 2.5}
              color={`var(--mantine-color-${selectedCategory?.color}-6)`}
            />
          )}

          <Title
            order={3}
            fz={'sm'}
            fw={'normal'}
            tt={!category ? undefined : 'uppercase'}
          >
            {!category ? selectedCategory?.title || item.title : item.title}
          </Title>
        </Group>

        {!!!category && !!selectedCategory ? (
          <Tooltip label={`Start '${selectedCategory?.title}' session`}>
            <Button
              size="compact-xs"
              variant="default"
              fw={'normal'}
              leftSection={
                <IconPlayerPlayFilled
                  size={ICON_SIZE - 8}
                  stroke={ICON_STROKE_WIDTH}
                />
              }
              disabled={!!sessionPomo || !!sessionStopwatch}
              onClick={() => {
                if (timerMode == null) return;

                if (timerMode.mode == 'timer') {
                  startPhase({
                    values: {
                      task_id: item.task_id,
                      category_id: selectedCategory?.id || null,
                    },
                  });
                }

                if (timerMode.mode == 'stopwatch') {
                  startTimer({
                    type: SessionType.STOPWATCH,
                    task_id: item.task_id,
                    category_id: selectedCategory?.id || null,
                  });
                }

                if (!category)
                  router.push(`/app/projects/${selectedCategory?.id}`);
              }}
            >
              {duration}
            </Button>
          </Tooltip>
        ) : (
          duration
        )}
      </Group>

      {selectedTask && (
        <Group>
          <Text inherit c={'dimmed'} fz={'xs'}>
            {selectedTask.title}
          </Text>
        </Group>
      )}

      <Group gap={'xs'}>
        <BadgeComponent type={item.type} />
      </Group>
    </Stack>
  );
}
