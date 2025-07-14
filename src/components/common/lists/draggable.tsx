'use client';

import React from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Divider, Skeleton, Stack } from '@mantine/core';
import { useDraggable, useSortableItem } from '@/hooks/sort/array';
import CardTaskMain from '../cards/task/main';

export default function Draggable({
  props,
}: {
  props: { list: any[]; color?: string };
}) {
  const {
    items,
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    getActiveItem,
  } = useDraggable({
    list: props?.list,
  });

  if (props.list == null || props.list == undefined) {
    // Avoid rendering mismatched DOM before hydration
    return (
      <Stack gap={'xs'}>
        <Skeleton h={64} />
        <Skeleton h={64} />
        <Skeleton h={64} />
        <Skeleton h={64} />
        <Skeleton h={64} />
      </Stack>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* <Stack gap={'xs'}> */}
        {items.map((item, i) => (
          <SortableItem
            key={item.id}
            props={{
              id: item.id,
              isActive: activeId === item.id,
            }}
          >
            <div
              key={item.id}
              style={{
                borderTopLeftRadius: i == 0 ? 8 : undefined,
                borderTopRightRadius: i == 0 ? 8 : undefined,
                overflow: 'hidden',
              }}
            >
              {items.indexOf(item) > 0 && <Divider />}
              <CardTaskMain props={{ ...item, color: props.color }} />
            </div>
          </SortableItem>
        ))}
        {/* </Stack> */}

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeId ? <CardTaskMain props={getActiveItem()} /> : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  props,
  children,
}: {
  props: { id: string; isActive?: boolean };
  children: React.ReactNode;
}) {
  const { setNodeRef, style } = useSortableItem(props);

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
