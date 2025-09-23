'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  NavLink,
  NumberFormatter,
  Skeleton,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconCategoryPlus, IconCircleFilled } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { linkify } from '@/utilities/formatters/string';
import Link from 'next/link';
import { TaskGet } from '@/types/models/task';
import MenuCategorySide from '@/components/common/menus/category/side';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { useMediaQuery } from '@mantine/hooks';
import { useCategoryActions } from '@/hooks/actions/categories';
import { SessionGet } from '@/types/models/session';
import { useTaskActions } from '@/hooks/actions/tasks';
import { useSessionActions } from '@/hooks/actions/sessions';
import InputTextRename from '@/components/common/inputs/text/rename';

export default function Child() {
  const pathname = usePathname();
  const tasks = useAppSelector((state) => state.tasks.value);
  const sessions = useAppSelector((state) => state.sessions.value);
  const appShell = useAppSelector((state) => state.appShell.value);
  const dispatch = useAppDispatch();
  const desktop = useMediaQuery('(min-width: 62em)');

  const {
    categories,
    createCategory,
    copyCategory,
    updateCategory,
    deleteCategory,
    categoryEditing,
    setCategoryEditingState,
    startCategoryRename,
    categoryInputRefs,
  } = useCategoryActions();
  const { createTask } = useTaskActions();
  const { createSession } = useSessionActions();

  return (
    <Stack p={`xs`} gap={'xs'}>
      <Group justify="space-between">
        <Title order={2} fz={'sm'} fw={500}>
          My Projects
        </Title>

        <Group>
          {categories == null ? (
            <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
          ) : (
            <Tooltip label={'Create project'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant="subtle"
                color="pri.5"
                onClick={() => createCategory()}
              >
                <IconCategoryPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>

      <Divider />

      <Stack gap={2}>
        {categories == null ? (
          <Stack gap={5}>
            <Skeleton h={32} />
            <Skeleton h={32} />
            <Skeleton h={32} />
          </Stack>
        ) : (
          categories?.map((category, i) => {
            const link = `/app/projects/${linkify(category.title)}-${linkify(category.id)}`;

            const itemCounts = getCategoryCount({
              sessions: sessions || [],
              tasks: tasks || [],
              categoryId: category.id,
            });

            return (
              <div key={i}>
                <MenuCategorySide
                  item={category}
                  menuProps={{
                    createSession,
                    createTask,
                    deleteCategory,
                    copyCategory,
                    startRename: () => startCategoryRename(category.id),
                  }}
                >
                  <NavLink
                    component={Link}
                    href={link}
                    active={link == pathname}
                    label={
                      <InputTextRename
                        ref={(el) => {
                          categoryInputRefs.current[category.id] = el;
                        }}
                        item={category}
                        renameProps={{
                          editing: categoryEditing,
                          setEditing: setCategoryEditingState,
                          updateItem: updateCategory,
                          placeholder: 'New Project',
                        }}
                      />
                    }
                    onClick={() => {
                      if (desktop) return;
                      if (appShell == null) return;

                      dispatch(
                        updateAppShell({
                          ...appShell,
                          child: { ...appShell.child, navbar: false },
                        })
                      );
                    }}
                    leftSection={
                      <Center h={ICON_SIZE} w={ICON_SIZE}>
                        <IconCircleFilled
                          size={ICON_SIZE / 2.5}
                          color={category.color || undefined}
                        />
                      </Center>
                    }
                    rightSection={
                      tasks == null ? (
                        <Skeleton h={ICON_SIZE / 2} w={ICON_SIZE / 2} />
                      ) : !itemCounts.tasks &&
                        !itemCounts.sessions ? undefined : (
                        <Tooltip
                          label={`${itemCounts.tasks || 0} tasks, ${itemCounts.sessions || 0} sessions`}
                        >
                          <NumberFormatter
                            value={
                              (itemCounts.tasks || 0) +
                              (itemCounts.sessions || 0)
                            }
                          />
                        </Tooltip>
                      )
                    }
                    style={navLinkStyles}
                  />
                </MenuCategorySide>
              </div>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}

export const navLinkStyles = {
  borderRadius: 'var(--mantine-radius-md)',
  padding:
    'calc(var(--mantine-spacing-xs) / 4) calc(var(--mantine-spacing-md) / 2)',
};

const getCategoryCount = (params: {
  tasks: TaskGet[];
  sessions: SessionGet[];
  categoryId: string;
}) => {
  const categroyTasks = params.tasks.filter(
    (t) => t.category_id == params.categoryId && t.complete == false
  );

  const categorySessions = params.sessions.filter(
    (s) => s.category_id == params.categoryId
  );

  return {
    tasks: categroyTasks.length,
    sessions: categorySessions.length,
  };
};
