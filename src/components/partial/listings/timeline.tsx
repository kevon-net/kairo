'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container, Stack } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';
import { isWithinPast7Days } from '@/utilities/helpers/time';
import ModalTaskCreate from '@/components/common/modals/task/create';

export default function Timeline() {
  const tasks = useAppSelector((state) => state.tasks.value);
  const tasksInSevenDays = useMemo(
    () => tasks?.filter((t) => isWithinPast7Days(new Date(t.created_at))),
    [tasks]
  );

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      <Stack gap={SECTION_SPACING / 2}>
        {tasks == null ? (
          taskSkeleton
        ) : !tasksInSevenDays?.length ? (
          <PlaceholderEmpty
            props={{
              title: 'No Sessions In Past 7 Days',
              desc: 'Start a new session now.',
            }}
          >
            <ModalTaskCreate>
              <Button size="xs">Add task</Button>
            </ModalTaskCreate>
          </PlaceholderEmpty>
        ) : (
          <AccordionTasks props={{ tasks: tasksInSevenDays }} />
        )}
      </Stack>
    </Container>
  );
}
