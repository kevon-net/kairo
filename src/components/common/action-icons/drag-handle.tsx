import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { useSortable } from '@dnd-kit/sortable';
import { ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import React from 'react';

export default function DragHandle({ params }: { params: { id: string } }) {
  const { attributes, listeners, isDragging } = useSortable({ id: params.id });

  return (
    <ActionIcon
      size={ICON_WRAPPER_SIZE / 1.5}
      radius={'xs'}
      variant="subtle"
      color="gray"
      {...listeners}
      {...attributes}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <IconGripVertical size={ICON_SIZE / 1.5} stroke={ICON_STROKE_WIDTH * 2} />
    </ActionIcon>
  );
}
