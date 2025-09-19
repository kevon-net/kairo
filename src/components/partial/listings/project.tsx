'use client';

import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { SECTION_SPACING } from '@/data/constants';
import { Button, Container } from '@mantine/core';
import { capitalizeWords } from '@/utilities/formatters/string';
import { useTaskActions } from '@/hooks/actions/tasks';

export default function Project({
  props,
}: {
  props: { projectTitle: string | null; projectId: string | null };
}) {
  const { tasks, categories, createTask } = useTaskActions();

  const categoryTasks = tasks?.filter((t) => t.category_id == props.projectId);
  const category = categories?.find((c) => c.id == props.projectId);

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null || categories == null ? (
        'loading ui goes here' // Avoid rendering mismatched DOM before hydration
      ) : !category ? (
        <PlaceholderEmpty
          props={{
            title: 'Project not found',
            desc: "The project doesn't seem to exist.",
          }}
        />
      ) : !categoryTasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: `No ${capitalizeWords(props.projectTitle || '')} Tasks Found`,
            desc: 'Add some tasks to get started',
          }}
        >
          <Button
            size="xs"
            onClick={() =>
              createTask({ values: { category_id: props.projectId } })
            }
          >
            Add task
          </Button>
        </PlaceholderEmpty>
      ) : (
        'list tasks here'
      )}
    </Container>
  );
}
