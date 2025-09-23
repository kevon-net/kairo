'use client';

import React from 'react';
import {
  Divider,
  Group,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from '@mantine/core';
import classes from './category.module.scss';
import { IconChartDots, IconCheckbox, IconLogs } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useTabAside } from '@/hooks/tab/navbar';
import PartialTabMainTasks from '@/components/partial/tabs/main/tasks';
import PartialTabMainSessions from '@/components/partial/tabs/main/sessions';

export default function Category() {
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
        justify="center"
        grow
        style={{ gap: 5, zIndex: 1 }}
        pos={'sticky'}
        top={0}
        px={'xs'}
        bg={'var(--mantine-color-body)'}
      >
        <TabsTab value="sessions">
          <Group justify="center">
            <IconLogs size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

            <Text inherit>Sessions</Text>
          </Group>
        </TabsTab>

        <TabsTab value="tasks" disabled={!category}>
          <Group justify="center">
            <IconCheckbox size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

            <Text inherit>Tasks</Text>
          </Group>
        </TabsTab>

        <TabsTab value="analytics">
          <Group justify="center">
            <IconChartDots size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

            <Text inherit>Analytics</Text>
          </Group>
        </TabsTab>
      </TabsList>

      <Divider />

      <TabsPanel value="sessions">
        <PartialTabMainSessions />
      </TabsPanel>

      <TabsPanel value="tasks">
        <PartialTabMainTasks />
      </TabsPanel>

      <TabsPanel value="analytics">Analytics</TabsPanel>
    </Tabs>
  );
}
