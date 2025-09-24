'use client';

import React from 'react';
import {
  Group,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import classes from './right.module.scss';
import { IconChartDots, IconCheckbox, IconLogs } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { useTabAside } from '@/hooks/tab/navbar';
import PartialTabAsideTasks from '@/components/partial/tabs/aside/tasks';
import PartialTabAsideSessions from '@/components/partial/tabs/aside/sessions';

export default function Right() {
  const { activeTab, setActiveTab, category } = useTabAside();

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      variant="pills"
      keepMounted
      classNames={classes}
    >
      <TabsList
        style={{ gap: 5, zIndex: 1 }}
        pos={'sticky'}
        top={0}
        pl={'xs'}
        mr={'xs'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
        }
      >
        <TabsTab value="sessions">
          <Tooltip label={'Sessions'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconLogs size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="tasks" disabled={!category}>
          <Tooltip
            multiline={!category}
            w={!category ? 180 : undefined}
            ta={!category ? 'center' : undefined}
            label={
              <Text component="span" inherit>
                Tasks
                {!category && (
                  <>
                    <br />
                    (Select a project to enable)
                  </>
                )}
              </Text>
            }
          >
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconCheckbox size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="analytics">
          <Tooltip label={'Analytics'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconChartDots size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>
      </TabsList>

      <TabsPanel value="sessions">
        <PartialTabAsideSessions />
      </TabsPanel>

      <TabsPanel value="tasks">
        <PartialTabAsideTasks />
      </TabsPanel>

      <TabsPanel value="analytics">Analytics</TabsPanel>
    </Tabs>
  );
}
