import React, { useEffect, useState } from 'react';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { SessionGet } from '@/types/models/session';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { SessionType } from '@generated/prisma';
import { useAppSelector } from '@/hooks/redux';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { useSessionTimer } from '@/components/contexts/session-timer';

export default function Main({ item }: { item: SessionGet }) {
  const tasks = useAppSelector((state) => state.tasks.value);
  const selectedTask = tasks?.find((t) => t.id == item.task_id);

  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { session: sessionPomo } = usePomo();
  const { session: sessionStopwatch } = useSessionTimer();

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

  return (
    <Stack gap={'xs'}>
      <Group justify="space-between">
        <Title order={3} fz={'md'} fw={'normal'} tt={'uppercase'}>
          {item.title}
        </Title>

        <Text c={'dimmed'} fz={'sm'}>
          {prependZeros(Number(hourMinSec?.hours || 0), 2)}:
          {prependZeros(Number(hourMinSec?.minutes || 0), 2)}:
          {prependZeros(Number(hourMinSec?.seconds || 0), 2)}
        </Text>
      </Group>

      <Group justify={selectedTask ? 'space-between' : 'end'}>
        {selectedTask && (
          <Group gap={'xs'}>
            <InputCheckboxTask item={selectedTask} />

            <Text inherit c={'dimmed'} fz={'sm'}>
              {selectedTask.title}
            </Text>
          </Group>
        )}

        <BadgeComponent type={item.type} />
      </Group>
    </Stack>
  );
}

export function BadgeComponent({ type }: { type: SessionType }) {
  let badgeProps = { label: '', variant: '' };

  switch (type) {
    case SessionType.STOPWATCH:
      return null;
    case SessionType.POMO_FOCUS:
      badgeProps = { label: 'Focus', variant: 'default' };
      break;
    case SessionType.POMO_BREAK:
      badgeProps = { label: 'Break', variant: 'white' };
      break;
    default:
      break;
  }

  return (
    <Badge size="xs" variant={badgeProps.variant}>
      {badgeProps.label}
    </Badge>
  );
}
