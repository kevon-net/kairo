'use client';

import { ICON_WRAPPER_SIZE } from '@/data/constants';
import { useTaskActions } from '@/hooks/actions/tasks';
import { TaskGet } from '@/types/models/task';
import { Checkbox } from '@mantine/core';
import React from 'react';

export default function Task({ item }: { item: TaskGet }) {
  const { updateTask } = useTaskActions();

  return (
    <Checkbox
      checked={item.complete}
      onChange={(event) => {
        updateTask({
          values: { ...item, complete: event.currentTarget.checked },
        });
      }}
      radius="xl"
      styles={{
        input: {
          width: ICON_WRAPPER_SIZE / 1.5,
          height: ICON_WRAPPER_SIZE / 1.5,
          border: `1.5px solid var(--mantine-color-pri-7)`,
        },
        icon: {
          width: ICON_WRAPPER_SIZE / 3,
          height: ICON_WRAPPER_SIZE / 3,
          marginRight: 6,
        },
      }}
    />
  );
}
