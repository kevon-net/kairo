'use client';

import React from 'react';

import { SegmentedControl, Center } from '@mantine/core';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useColorSchemeHandler } from '@/hooks/color-scheme';

export default function Theme() {
  const { colorScheme, handleChange } = useColorSchemeHandler();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(v) => handleChange(v)}
      fullWidth
      data={[
        {
          label: (
            <Center>
              <IconSun size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Center>
          ),
          value: 'light',
        },
        {
          label: (
            <Center>
              <IconMoon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Center>
          ),
          value: 'dark',
        },
        {
          label: (
            <Center>
              <IconDeviceDesktop size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </Center>
          ),
          value: 'auto',
        },
      ]}
    />
  );
}
