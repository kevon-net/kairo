import React from 'react';
import {
  Group,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Tooltip,
} from '@mantine/core';
import classes from './right.module.scss';
import { IconChartDots, IconCheckbox, IconLogs } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Right() {
  return (
    <Tabs defaultValue="sessions" variant="pills" classNames={classes}>
      <TabsList
        style={{ gap: 5 }}
        pos={'sticky'}
        top={0}
        px={'xs'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
        }
      >
        <TabsTab value="sessions">
          <Tooltip label={'Sessions'}>
            <Group justify="center">
              <IconLogs size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="tasks">
          <Tooltip label={'Tasks'}>
            <Group justify="center">
              <IconCheckbox size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="analytics">
          <Tooltip label={'Analytics'}>
            <Group justify="center">
              <IconChartDots size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </Tooltip>
        </TabsTab>
      </TabsList>

      <TabsPanel value="sessions">Sessions</TabsPanel>

      <TabsPanel value="tasks">Tasks</TabsPanel>

      <TabsPanel value="analytics">Analytics</TabsPanel>
    </Tabs>
  );
}
