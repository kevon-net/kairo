'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';
import { isWithinNext7Days } from '@/utilities/helpers/time';
import ModalTaskCreate from '@/components/common/modals/task/create';

export default function Upcoming() {
  const tasks = useAppSelector((state) => state.tasks.value);

  const tasksInSevenDays = useMemo(
    () =>
      tasks?.filter((t) =>
        isWithinNext7Days(
          t.due_date || t.reminders.length
            ? new Date(t.due_date || t.reminders[0].remind_at)
            : null
        )
      ),
    [tasks]
  );

  const now = new Date();
  const tomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString();

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !tasksInSevenDays?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Due In Next 7 Days',
            desc: 'Add some tasks to get done this week.',
          }}
        >
          <ModalTaskCreate
            props={{
              defaultValues: {
                properties: { due_date: tomorrow },
              },
            }}
          >
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: tasksInSevenDays,
            defaultValues: { dueDate: tomorrow },
          }}
        />
      )}
    </Container>
  );
}
