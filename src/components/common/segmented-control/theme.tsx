'use client';

import React from 'react';

import { SegmentedControl, Group } from '@mantine/core';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { iconSize, iconStrokeWidth } from '@/data/constants';
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
              <IconSun size={iconSize} stroke={iconStrokeWidth} />
            </Group>
          ),
          value: 'light',
        },
        {
          label: (
            <Group>
              <IconMoon size={iconSize} stroke={iconStrokeWidth} />
            </Group>
          ),
          value: 'dark',
        },
        {
          label: (
            <Group>
              <IconDeviceDesktop size={iconSize} stroke={iconStrokeWidth} />
            </Group>
          ),
          value: 'auto',
        },
      ]}
    />
  );
}
