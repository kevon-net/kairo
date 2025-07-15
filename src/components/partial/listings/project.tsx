'use client';

import React, { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container } from '@mantine/core';
import ModalTaskCreate from '@/components/common/modals/task/create';
import AccordionTasks, {
  taskSkeleton,
} from '@/components/common/accordions/tasks';
import { capitalizeWords } from '@/utilities/formatters/string';

export default function Project({
  props,
}: {
  props: { projectTitle: string | null; projectId: string | null };
}) {
  const projects = useAppSelector((state) => state.categories.value);
  const project = useMemo(
    () => projects?.find((p) => p.id == props.projectId),
    [projects, props.projectId]
  );

  const tasks = useAppSelector((state) => state.tasks.value);
  const tasksOfCategory = useMemo(
    () => tasks?.filter((t) => t.category_id == props.projectId),
    [tasks, props.projectId]
  );

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null || projects == null ? (
        taskSkeleton // Avoid rendering mismatched DOM before hydration
      ) : !project ? (
        <PlaceholderEmpty
          props={{
            title: 'Project not found',
            desc: "The project doesn't seem to exist.",
          }}
        />
      ) : !tasksOfCategory?.length ? (
        <PlaceholderEmpty
          props={{
            title: `No ${capitalizeWords(props.projectTitle || '')} Tasks Found`,
            desc: 'Add some tasks to get started',
          }}
        >
          <ModalTaskCreate
            props={{
              defaultValues: {
                properties: { category_id: props.projectId || '' },
              },
            }}
          >
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks props={{ tasks: tasksOfCategory }} />
      )}
    </Container>
  );
}
