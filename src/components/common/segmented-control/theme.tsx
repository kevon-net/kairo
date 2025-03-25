'use client';

import React from 'react';

import { SegmentedControl, Group } from '@mantine/core';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useColorSchemeHandler } from '@/hooks/color-scheme';

export default function Theme() {
  const { colorScheme, handleChange } = useColorSchemeHandler();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(v) => handleChange(v)}
      data={[
        {
          label: (
            <Group>
              <IconSun size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          ),
          value: 'light',
        },
        {
          label: (
            <Group>
              <IconMoon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          ),
          value: 'dark',
        },
        {
          label: (
            <Group>
              <IconDeviceDesktop size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Group>
          ),
          value: 'auto',
        },
      ]}
    />
  );
}
