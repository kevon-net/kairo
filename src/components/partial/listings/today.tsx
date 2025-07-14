'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';
import { isToday } from '@/utilities/helpers/time';
import ModalTaskCreate from '@/components/common/modals/task/create';

export default function Today() {
  const tasks = useAppSelector((state) => state.tasks.value);

  const dueTasks = useMemo(
    () => tasks?.filter((t) => t.due_date || t.reminders.length),
    [tasks]
  );

  const todayTasks = useMemo(
    () =>
      dueTasks?.filter((t) =>
        t.due_date || t.reminders.length
          ? isToday(t.due_date || t.reminders[0].remind_at)
          : false
      ),
    [dueTasks]
  );

  const now = new Date().toISOString();

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !todayTasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Due Today',
            desc: 'Add some tasks to get done today.',
          }}
        >
          <ModalTaskCreate
            props={{
              defaultValues: {
                properties: { due_date: now },
              },
            }}
          >
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: todayTasks,
            defaultValues: { dueDate: now },
          }}
        />
      )}
    </Container>
  );
}
