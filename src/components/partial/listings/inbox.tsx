'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';
import ModalTaskCreate from '@/components/common/modals/task/create';

export default function Inbox() {
  const tasks = useAppSelector((state) => state.tasks.value);

  const tasksWithoutCategory = useMemo(
    () => tasks?.filter((task) => !task.category_id),
    [tasks]
  );

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !tasksWithoutCategory?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Inbox Tasks Found',
            desc: 'Tasks without a category will be listed here. Add some tasks to get started.',
          }}
        >
          <ModalTaskCreate>
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: tasksWithoutCategory,
          }}
        />
      )}
    </Container>
  );
}
