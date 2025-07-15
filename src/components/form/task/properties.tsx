'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { getRegionalDate } from '@/utilities/formatters/date';
import { useAppSelector } from '@/hooks/redux';
import { FormTask } from '@/hooks/form/task';
import ComboboxTaskProject from '@/components/common/inputs/combobox/task/project';
import ComboboxTaskDueDate from '@/components/common/inputs/combobox/task/date';
import ModalPrompt from '@/components/common/modals/prompt';

export default function Properties({
  props,
}: {
  props: {
    form: FormTask;
    handleDelete: () => void;
    submitted: boolean;
    handleSubmit: (operation: () => void) => Promise<void>;
    id?: string;
    parentModalstate?: { opened: boolean; close: () => void };
  };
}) {
  const tasks = useAppSelector((state) => state.tasks.value);
  const task = useMemo(
    () => tasks?.find((t) => t.id === props.id),
    [tasks, props.id]
  );

  return (
    <Stack justify="space-between">
      <Stack gap={'xs'} p={'md'} pos={'relative'} style={{ zIndex: 0 }}>
        <Stack gap={5}>
          <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
            Project
          </Title>
          <ComboboxTaskProject
            props={{ formTask: props.form, inputProps: { width: '100%' } }}
          />
        </Stack>

        <Divider />

        <Stack gap={5}>
          <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
            Date
          </Title>
          <ComboboxTaskDueDate
            props={{ form: props.form, inputProps: { width: '100%' } }}
          />
        </Stack>
      </Stack>

      <Box pos={'sticky'} bottom={0}>
        <Divider />

        <Box
          fz={'xs'}
          px={'md'}
          py={'sm'}
          c={'dimmed'}
          bg={
            'light-dark(var(--mantine-color-gray-0),var(--mantine-color-dark-7))'
          }
          style={{ zIndex: 1 }}
        >
          <Group justify="space-between">
            <Text component="span" inherit>
              Created on{' '}
              {task?.created_at ? getRegionalDate(task.created_at).date : ''}
            </Text>

            <ModalPrompt
              props={{
                title: 'Delete Task?',
                color: 'red.6',
                modalContent: (
                  <Text>
                    The &apos;
                    <Text component="span" inherit fw={'bold'}>
                      {task?.title}
                    </Text>
                    &apos; task will be permanently deleted.
                  </Text>
                ),
                parentModalstate: props.parentModalstate,
                actions: {
                  confirm: async () => {
                    await props.handleSubmit(props.handleDelete);
                    props.parentModalstate?.close();
                  },
                },
                loading: props.submitted,
              }}
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="red.6"
                variant="subtle"
              >
                <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </ModalPrompt>
          </Group>
        </Box>
      </Box>
    </Stack>
  );
}
