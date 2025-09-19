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
  NavLink,
  NumberFormatter,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import {
  IconCategory,
  IconCategoryPlus,
  IconHome,
  IconSearch,
  IconTimeline,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { linkify } from '@/utilities/formatters/string';
import Link from 'next/link';
import { TaskGet } from '@/types/models/task';
import SpotlightSearch from '@/components/spotlights/search';
import MenuCategory from '@/components/common/menus/category';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { useMediaQuery } from '@mantine/hooks';
import { useCategoryActions } from '@/hooks/actions/categories';
import { SessionGet } from '@/types/models/session';
import { useTaskActions } from '@/hooks/actions/tasks';
import { useSessionActions } from '@/hooks/actions/sessions';

export default function App() {
  const pathname = usePathname();
  const categories = useAppSelector((state) => state.categories.value);
  const tasks = useAppSelector((state) => state.tasks.value);
  const sessions = useAppSelector((state) => state.sessions.value);
  const dispatch = useAppDispatch();
  const desktop = useMediaQuery('(min-width: 62em)');

  const { createCategory, deleteCategory, copyCategory, startCategoryRename } =
    useCategoryActions();
  const { createTask } = useTaskActions();
  const { createSession } = useSessionActions();

  return (
    <Stack px={`xs`} pb={'xs'} maw={'100vw'}>
      <Stack gap={2}>
        <SpotlightSearch>
          <NavLink
            label={'Search'}
            leftSection={
              <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            style={navLinkStyles}
          />
        </SpotlightSearch>

        {navLinks.map((link, index) => {
          return (
            <div key={index}>
              <NavLink
                component={Link}
                href={link.link}
                active={link.link == pathname}
                label={link.label}
                onClick={() => {
                  if (desktop) return;
                  dispatch(updateAppShell({ navbar: false }));
                }}
                leftSection={
                  <link.icon
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                    color={
                      link.link == pathname
                        ? 'var(--mantine-color-pri-7)'
                        : 'var(--mantine-color-text)'
                    }
                  />
                }
                style={navLinkStyles}
              />
            </div>
          );
        })}
      </Stack>

      <Divider />

      <Stack>
        <Group justify="space-between" pl={8} pr={'xs'}>
          <Title order={2} fz={'sm'} fw={500}>
            My Projects
          </Title>

          <Group>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              variant="subtle"
              color="pri.5"
              onClick={() => createCategory()}
            >
              <IconCategoryPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>
        </Group>

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
                <Group key={i} pos={'relative'}>
                  <MenuCategory
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
                      label={category.title}
                      onClick={() => {
                        if (desktop) return;
                        dispatch(updateAppShell({ navbar: false }));
                      }}
                      leftSection={
                        <IconCategory
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                          color={category.color || undefined}
                        />
                      }
                      rightSection={
                        <Box>
                          <span>
                            {tasks == null ? (
                              <Skeleton h={ICON_SIZE / 2} w={ICON_SIZE / 2} />
                            ) : !itemCounts.tasks ? undefined : (
                              <NumberFormatter value={itemCounts.tasks} />
                            )}
                          </span>

                          <span>
                            {sessions == null ? (
                              <Skeleton h={ICON_SIZE / 2} w={ICON_SIZE / 2} />
                            ) : !itemCounts.sessions ? undefined : (
                              <NumberFormatter value={itemCounts.sessions} />
                            )}
                          </span>
                        </Box>
                      }
                      style={navLinkStyles}
                    />
                  </MenuCategory>
                </Group>
              );
            })
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export const navLinks = [
  {
    icon: IconHome,
    label: 'Home',
    link: '/app/home',
  },
  {
    icon: IconTimeline,
    label: 'Timeline',
    link: '/app/timeline',
  },
];

export const navLinkStyles = {
  borderRadius: 'var(--mantine-radius-md)',
  paddingTop: 'calc(var(--mantine-spacing-md) / 4)',
  paddingBottom: 'calc(var(--mantine-spacing-md) / 4)',
  paddingLeft: 'calc(var(--mantine-spacing-md) / 2)',
  paddingRight: 'calc(var(--mantine-spacing-md) / 1)',
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
