import React, { useEffect, useState } from 'react';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { SessionGet } from '@/types/models/session';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { SessionType } from '@generated/prisma';
import { useAppSelector } from '@/hooks/redux';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { usePomo } from '@/components/contexts/pomo-cycles';

export default function Main({ item }: { item: SessionGet }) {
  const tasks = useAppSelector((state) => state.tasks.value);
  const selectedTask = tasks?.find((t) => t.id == item.task_id);

  const { session } = usePomo();

  const [elapsedTime, setElapsedTime] = useState(item.elapsed);

  const hourMinSec = secToHourMinSec(elapsedTime);

  useEffect(() => {
    if (session && session.id == item.id) setElapsedTime(session.elapsed || 0);
  }, [session]);

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
