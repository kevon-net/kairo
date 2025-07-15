'use client';

import { Box, Group, Stack, Text, Title } from '@mantine/core';
import React, { useMemo } from 'react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { IconCategory } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useFormTask } from '@/hooks/form/task';
import classes from './main.module.scss';
// import ActionIconDragHandle from '../../action-icons/drag-handle';
import { updateSelectedTask } from '@/libraries/redux/slices/tasks';
import InputCheckboxTask from '../../inputs/checkboxes/task';

export default function Main({
  props,
}: {
  props: { id: string; color?: string };
}) {
  const tasks = useAppSelector((state) => state.tasks.value);
  const task = useMemo(
    () => tasks?.find((t) => t.id === props.id),
    [tasks, props.id]
  );

  const categories = useAppSelector((state) => state.categories.value);
  const category = useMemo(
    () => categories?.find((c) => c.id === task?.category_id),
    [categories, task?.category_id]
  );

  const dispatch = useAppDispatch();

  const { form } = useFormTask({ id: props.id });

  return (
    <Box className={classes.card}>
      <Group align="start" gap={'xs'} wrap="nowrap" w={'100%'}>
        <Group
          gap={5}
          wrap="nowrap"
          mt={'sm'}
          pl={'xs'} // comment this out when adding drag handle
        >
          {/* <div className={classes.grip}>
            <ActionIconDragHandle params={{ id: props.id }} />
          </div> */}

          <InputCheckboxTask props={{ form }} />
        </Group>

        <Box
          onClick={() => {
            if (task) dispatch(updateSelectedTask(task));
          }}
          w={'100%'}
          py={'xs'}
          style={{ cursor: 'pointer' }}
        >
          <Stack gap={5} mt={2}>
            <Title order={2} fz={'sm'} fw={'normal'}>
              {task?.title}
            </Title>

            <Group gap={'xs'}>
              {task?.category_id && (
                <>
                  <Group gap={5} c={'dimmed'}>
                    <IconCategory
                      size={ICON_SIZE / 1.5}
                      stroke={ICON_STROKE_WIDTH * 1.5}
                    />

                    <Text fz={'xs'} lineClamp={1}>
                      {category?.title}
                    </Text>
                  </Group>
                </>
              )}
            </Group>
          </Stack>
        </Box>
      </Group>
    </Box>
  );
}
