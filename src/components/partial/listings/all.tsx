'use client';

import React from 'react';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import { SECTION_SPACING } from '@/data/constants';
import { Container } from '@mantine/core';
import { useAppSelector } from '@/hooks/redux';
import PlaceholderEmpty from '@/components/placeholder/empty';

export default function All() {
  const tasks = useAppSelector((state) => state.tasks.value);

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !tasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Found',
            desc: 'Add some tasks to get started.',
          }}
        />
      ) : (
        <AccordionTasks props={{ tasks }} />
      )}
    </Container>
  );
}
