'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@/data/constants';
import {
  Button,
  Container,
  Group,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useAppSelector } from '@/hooks/redux';
import { getTimeOfDay, isWithinNext7Days } from '@/utilities/helpers/time';
import ModalTaskCreate from '@/components/common/modals/task/create';
import { capitalizeWords } from '@/utilities/formatters/string';
import PartialTaskCreate from '@/components/partial/task/create';
import { useFormTask } from '@/hooks/form/task';

export default function Home() {
  const tasks = useAppSelector((state) => state.tasks.value);
  const session = useAppSelector((state) => state.session.value);

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

  const { form, handleSubmit, addTaskToState, submitted } = useFormTask({
    defaultValues: { properties: { due_date: now.toISOString() } },
    options: { home: true },
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      <Stack gap={SECTION_SPACING / 2}>
        {session == null ? (
          <Group justify="center">
            <Skeleton height={26} width={260} />
          </Group>
        ) : (
          <Title order={1} fz={'xl'} fw={500} ta={'center'}>
            Good {getTimeOfDay()},{' '}
            {capitalizeWords(session?.user_metadata.name)}
          </Title>
        )}

        <PartialTaskCreate
          props={{
            form,
            handleClose,
            submitted,
            handleSubmit,
            addTaskToState,
          }}
        />

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
      </Stack>
    </Container>
  );
}
