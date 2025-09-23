'use client';

import { Button, Group, Tooltip } from '@mantine/core';
import React from 'react';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { TaskGet } from '@/types/models/task';
import InputTextareaRename from '../../inputs/textarea/rename';
import { useTaskActions } from '@/hooks/actions/tasks';
import MenuTaskSide from '../../menus/task/side';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { prependZeros } from '@/utilities/formatters/number';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { useTotalElapsedTask } from '@/hooks/session';
import { useSessionTimer } from '@/components/contexts/session-timer';
import { useAppSelector } from '@/hooks/redux';
import { SessionType } from '@generated/prisma';

export default function Main({ item }: { item: TaskGet }) {
  const {
    deleteTask,
    copyTask,
    updateTask,
    taskEditing,
    setTaskEditingState,
    startTaskRename,
    taskInputRefs,
  } = useTaskActions();

  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { session: sessionPomo, startPhase } = usePomo();
  const { session: sessionStopwatch, startTimer } = useSessionTimer();

  const { hourMinSec } = useTotalElapsedTask({ task: item });

  return (
    <MenuTaskSide
      item={item}
      menuProps={{
        createSession: () => {},
        deleteTask: deleteTask,
        copyTask: copyTask,
        startRename: () => startTaskRename(item.id),
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="start">
        <Group gap={'xs'} wrap="nowrap" w={'100%'} align="start">
          <Group gap={5} wrap="nowrap" mt={2}>
            <InputCheckboxTask item={item} />
          </Group>

          <InputTextareaRename
            ref={(el) => {
              taskInputRefs.current[item.id] = el;
            }}
            item={item}
            renameProps={{
              editing: taskEditing,
              setEditing: setTaskEditingState,
              updateItem: updateTask,
              placeholder: 'New Task',
            }}
          />
        </Group>

        <Group justify="end">
          <Tooltip
            label={`Start '${item.title}' session`}
            multiline
            w={180}
            ta={'center'}
          >
            <Button
              size="compact-xs"
              variant="default"
              fw={'normal'}
              leftSection={
                <IconPlayerPlayFilled
                  size={ICON_SIZE - 8}
                  stroke={ICON_STROKE_WIDTH}
                />
              }
              disabled={!!sessionPomo || !!sessionStopwatch}
              onClick={() => {
                if (timerMode == null) return;

                if (timerMode.mode == 'timer') {
                  startPhase({
                    values: { task_id: item.id, category_id: item.category_id },
                  });
                }

                if (timerMode.mode == 'stopwatch') {
                  startTimer({
                    type: SessionType.STOPWATCH,
                    task_id: item.id,
                    category_id: item.category_id,
                  });
                }
              }}
            >
              {prependZeros(Number(hourMinSec?.hours || 0), 2)}:
              {prependZeros(Number(hourMinSec?.minutes || 0), 2)}:
              {prependZeros(Number(hourMinSec?.seconds || 0), 2)}
            </Button>
          </Tooltip>
        </Group>
      </Group>
    </MenuTaskSide>
  );
}
