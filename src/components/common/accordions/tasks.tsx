'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import ListDraggable from '../lists/draggable';
import classes from './tasks.module.scss';
import CardCtaTaskCreate from '../cards/cta/task/create';
import { SECTION_SPACING } from '@/data/constants';
import { useEffect, useState } from 'react';
import { useGetOrganizedTasks } from '@/hooks/form/task/view';
import { TaskRelations } from '@/types/models/task';

export default function Tasks({
  props,
}: {
  props: {
    tasks: TaskRelations[] | null;
    completeTasks?: boolean;
  };
}) {
  const { organizedTasksState } = useGetOrganizedTasks({
    tasks: props.tasks || [],
    completeTasks: props.completeTasks,
  });

  const items = organizedTasksState.map((group, index) => {
    return (
      <AccordionItem
        key={`${index}-${group.title}`}
        value={`${index}-${group.title}`}
      >
        <AccordionControl>
          <Group>
            <Text component="span" fz={'md'} fw={500}>
              {group.title}
            </Text>

            {group.tasks.length && (
              <Text component="span" fz={'sm'} c={'dimmed'} mt={2}>
                (
                <NumberFormatter value={group.tasks.length} thousandSeparator />
                )
              </Text>
            )}
          </Group>
        </AccordionControl>

        <AccordionPanel pt={'xs'}>
          <ListDraggable props={{ list: group.tasks }} />

          <CardCtaTaskCreate />
        </AccordionPanel>
      </AccordionItem>
    );
  });

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue([
      ...value,
      ...organizedTasksState
        .map((group, index) => `${index}-${group.title}`)
        .filter((g) => {
          // only add group that's not in 'value'
          return !value.includes(g);
        }),
    ]);
  }, [organizedTasksState]);

  const singleGroup = organizedTasksState.length == 1;

  return (
    <Accordion
      multiple
      value={value}
      onChange={setValue}
      classNames={classes}
      chevron={singleGroup ? null : undefined}
      chevronPosition={singleGroup ? undefined : 'left'}
    >
      <Stack gap={SECTION_SPACING / 2}>{items}</Stack>
    </Accordion>
  );
}

const skeletonDetails = (
  <Stack gap={'xs'}>
    <Skeleton h={20} w={'70%'} />

    <Group pb={'md'}>
      <Skeleton h={10} w={'15%'} />
      <Skeleton h={10} w={'10%'} />
    </Group>
  </Stack>
);

const skeletonCard = (
  <Grid>
    <GridCol span={1}>
      <Group justify="end">
        <Skeleton h={20} w={20} radius={'xl'} />
      </Group>
    </GridCol>

    <GridCol span={11}>{skeletonDetails}</GridCol>
  </Grid>
);

const skeletonSection = (
  <Stack gap={'lg'}>
    <Skeleton h={24} w={'40%'} />

    <div>
      <Stack gap={2}>{skeletonCard}</Stack>
      <Stack gap={2}>{skeletonCard}</Stack>
    </div>
  </Stack>
);

export const taskSkeleton = (
  <Stack>
    {skeletonSection}
    {skeletonSection}
    {skeletonSection}
  </Stack>
);
