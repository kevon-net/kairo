import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core';
import { SessionGet } from '@/types/models/session';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { useTabAside } from '@/hooks/tab/navbar';
import { BadgeComponent } from './main';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { useRouter } from 'next/navigation';

export default function Aside({ item }: { item: SessionGet }) {
  const router = useRouter();

  const { category, categories, tasks } = useTabAside();
  const { session, startPhase } = usePomo();

  const selectedCategory =
    category || categories?.find((c) => c.id == item.category_id);
  const selectedTask = tasks?.find((t) => t.id == item.task_id);

  const [elapsedTime, setElapsedTime] = useState(item.elapsed);

  const hourMinSec = secToHourMinSec(elapsedTime);

  useEffect(() => {
    if (session && session.id == item.id) setElapsedTime(session.elapsed || 0);
  }, [session]);

  return (
    <Stack gap={5}>
      <Group justify="space-between" mih={24.8}>
        <Title
          order={3}
          fz={'sm'}
          fw={'normal'}
          tt={!category ? undefined : 'uppercase'}
        >
          {!category ? selectedCategory?.title || item.title : item.title}
        </Title>

        <Transition mounted={!category}>
          {(styles) => (
            <div style={styles}>
              <Tooltip label={`Start '${selectedCategory?.title}' session`}>
                <Button
                  size="compact-xs"
                  color="dark"
                  fw={'normal'}
                  leftSection={
                    <IconPlayerPlayFilled
                      size={ICON_SIZE - 8}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                  disabled={!!session}
                  onClick={() => {
                    startPhase({
                      values: {
                        task_id: item.task_id,
                        category_id: selectedCategory?.id || null,
                      },
                    });

                    if (!category)
                      router.push(`/app/projects/${selectedCategory?.id}`);
                  }}
                >
                  <Text inherit c={'dimmed'} fz={'xs'} ta={'end'}>
                    {prependZeros(Number(hourMinSec?.hours || 0), 2)}:
                    {prependZeros(Number(hourMinSec?.minutes || 0), 2)}:
                    {prependZeros(Number(hourMinSec?.seconds || 0), 2)}
                  </Text>
                </Button>
              </Tooltip>
            </div>
          )}
        </Transition>
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
