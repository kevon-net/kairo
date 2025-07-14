'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';

export default function Complete() {
  const tasks = useAppSelector((state) => state.tasks.value);
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.complete),
    [tasks]
  );

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !completedTasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Completed Tasks',
            desc: 'Your completed tasks will appear here.',
          }}
        />
      ) : (
        <AccordionTasks
          props={{ tasks: completedTasks, completeTasks: true }}
        />
      )}
    </Container>
  );
}
