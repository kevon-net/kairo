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
  IconDots,
  IconHome,
  IconSearch,
  IconTimeline,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { linkify } from '@/utilities/formatters/string';
import Link from 'next/link';
import { TaskRelations } from '@/types/models/task';
import SpotlightSearch from '@/components/spotlights/search';
import classes from './main.module.scss';
import MenuProject from '@/components/common/menus/project';
import { updateSelectedCategory } from '@/libraries/redux/slices/categories';
import { generateUUID } from '@/utilities/generators/id';
import { CategoryGet } from '@/types/models/category';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { useMediaQuery } from '@mantine/hooks';

export default function App() {
  const pathname = usePathname();
  const categories = useAppSelector((state) => state.categories.value);
  const tasks = useAppSelector((state) => state.tasks.value);
  const dispatch = useAppDispatch();
  const desktop = useMediaQuery('(min-width: 62em)');

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
              onClick={() =>
                dispatch(
                  updateSelectedCategory({ id: generateUUID() } as CategoryGet)
                )
              }
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
            categories?.map((category, index) => {
              const link = `/app/projects/${linkify(category.title)}-${linkify(category.id)}`;

              const taskCount = getCategoryCount(tasks || [], category.id);

              const projectTaskCount =
                tasks == null ? (
                  <Skeleton h={ICON_SIZE / 2} w={ICON_SIZE / 2} />
                ) : !taskCount ? undefined : (
                  <Group fz={'sm'} className={classes.count}>
                    <NumberFormatter value={taskCount} />
                  </Group>
                );

              return (
                <Group
                  key={index}
                  pos={'relative'}
                  className={classes.container}
                >
                  <Group justify="end" className={classes.overlay}>
                    <Box hiddenFrom="md">{projectTaskCount}</Box>

                    <MenuProject props={{ id: category.id }}>
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE}
                        variant="transparent"
                        color="gray"
                      >
                        <IconDots size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                      </ActionIcon>
                    </MenuProject>
                  </Group>

                  <NavLink
                    component={Link}
                    href={link}
                    active={link == pathname}
                    label={category.title}
                    onClick={() => {
                      if (desktop) return;
                      dispatch(updateAppShell({ navbar: false }));
                    }}
                    className={classes.link}
                    leftSection={
                      <IconCategory
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                        color={category.color}
                      />
                    }
                    rightSection={
                      <Box visibleFrom="md">{projectTaskCount}</Box>
                    }
                    style={navLinkStyles}
                  />
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

const getCategoryCount = (tasks: TaskRelations[], categoryId: string) => {
  return tasks.filter(
    (t) => t.category_id && t.category_id == categoryId && t.complete == false
  ).length;
};
