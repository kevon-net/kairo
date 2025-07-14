'use client';

import React, { useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  Modal,
  Overlay,
  ScrollArea,
  ScrollAreaAutosize,
  Text,
} from '@mantine/core';
import { navLinks } from '@/components/layout/navbars/app/main';
import {
  APPSHELL,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  MODAL_HEIGHT,
} from '@/data/constants';
import { IconCell, IconX } from '@tabler/icons-react';
import FormTaskProperties from '@/components/form/task/properties';
import FormTaskView from '@/components/form/task/view';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSelectedTask } from '@/libraries/redux/slices/tasks';
import { useFormTask } from '@/hooks/form/task';
import IndicatorNetworkStatus from '@/components/indicators/network-status';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { useMediaQuery, useResizeObserver } from '@mantine/hooks';
import { SyncStatus } from '@generated/prisma';

export default function View({ children }: { children: React.ReactNode }) {
  const syncStatus = useAppSelector((state) => state.syncStatus.value);
  const selectedTask = useAppSelector((state) => state.tasks.selectedTask);

  const tasks = useAppSelector((state) => state.tasks.value);
  const task = useMemo(
    () => tasks?.find((t) => t.id == selectedTask?.id),
    [tasks, selectedTask?.id]
  );

  const categories = useAppSelector((state) => state.categories.value);
  const category = useMemo(
    () => categories?.find((c) => c.id == task?.category_id),
    [categories, task?.category_id]
  );

  const dispatch = useAppDispatch();

  const close = () => {
    if (form.isDirty('title') || form.isDirty('description')) {
      const wrapperElement = document.getElementById(wrapperId);
      wrapperElement?.click();
    } else {
      dispatch(updateSelectedTask(null));
    }
  };

  const pathname = usePathname();
  const navlink = navLinks.find((link) => link.link == pathname);

  const { form, submitted, handleDelete, handleSubmit, updateState } =
    useFormTask();

  const [focused, setFocused] = useState(false);

  const mobile = useMediaQuery('(min-width: 36em)');
  const tablet = useMediaQuery('(min-width: 48em)');

  const [refHeader, header] = useResizeObserver();
  const [refProperties, properties] = useResizeObserver();

  const col1 = (
    <Group gap={'xs'} wrap="nowrap" p={'md'} align="start">
      <Group mt={8}>
        <InputCheckboxTask props={{ form }} />
      </Group>

      <FormTaskView
        props={{
          form,
          submitted,
          handleSubmit,
          updateState,
          wrapperId,
          setFocused,
        }}
      />
    </Group>
  );

  const col2 = (
    <FormTaskProperties
      props={{
        form,
        handleDelete,
        submitted,
        handleSubmit,
        id: task?.id,
        parentModalstate: {
          opened: !!selectedTask,
          close,
        },
      }}
    />
  );

  return (
    <>
      <Modal
        opened={!!selectedTask}
        onClose={close}
        withCloseButton={false}
        centered
        fullScreen={!mobile}
        size={'xl'}
        padding={0}
        pos={'relative'}
      >
        <Box
          pos={'sticky'}
          top={0}
          bg={'var(--mantine-color-body)'}
          style={{ zIndex: 10 }}
          ref={refHeader}
        >
          <Group justify="space-between" p={'sm'}>
            <Group gap={5}>
              {navlink ? (
                <navlink.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              ) : (
                <IconCell size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              )}

              <Text component="span" inherit fz={'sm'} fw={500} lineClamp={1}>
                {navlink?.label || category?.title || task?.title}
              </Text>
            </Group>

            <Group gap={'xs'}>
              <IndicatorNetworkStatus
                props={{
                  itemSyncStatus:
                    syncStatus == SyncStatus.SAVED ||
                    syncStatus == SyncStatus.SYNCED
                      ? syncStatus
                      : task?.sync_status,
                }}
              />

              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="gray"
                variant="subtle"
                onClick={() => dispatch(updateSelectedTask(null))}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </Group>

          <Divider />
        </Box>

        <Grid gutter={0}>
          <GridCol span={{ base: 12, sm: 7.5, md: 8 }}>
            <div
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              {tablet ? (
                <ScrollAreaAutosize
                  type="auto"
                  scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
                  h={MODAL_HEIGHT.TASK_VIEW}
                  scrollbars={'y'}
                >
                  {col1}
                </ScrollAreaAutosize>
              ) : (
                <div
                  style={{
                    minHeight: `calc(100vh - (${header.height}px + ${properties.height}px))`,
                  }}
                >
                  {col1}
                </div>
              )}
            </div>
          </GridCol>

          <GridCol
            span={{ base: 12, sm: 4.5, md: 4 }}
            bg={
              'light-dark(var(--mantine-color-gray-0),var(--mantine-color-dark-7))'
            }
            pos={'relative'}
          >
            {
              <ScrollArea
                type="auto"
                scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
                h={{ base: '100%', sm: MODAL_HEIGHT.TASK_VIEW }}
                scrollbars={'y'}
                pos={'relative'}
                ref={refProperties}
              >
                {col2}
              </ScrollArea>
            }

            {focused && <Overlay backgroundOpacity={0.4} />}
          </GridCol>
        </Grid>
      </Modal>

      <div>{children}</div>
    </>
  );
}

const wrapperId = 'taskViewPrompt';
