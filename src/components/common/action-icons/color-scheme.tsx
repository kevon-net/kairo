'use client';

import { ActionIcon } from '@mantine/core';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useColorScheme } from '@/hooks/color-scheme';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';

export default function ColorScheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const display = {
    icon:
      colorScheme == 'auto'
        ? IconSun
        : colorScheme == 'light'
          ? IconMoon
          : IconDeviceDesktop,
  };

  return (
    <ActionIcon
      onClick={() => {
        if (colorScheme == 'light') setColorScheme('dark');
        else if (colorScheme == 'dark') setColorScheme('auto');
        else setColorScheme('light');
      }}
      variant="default"
      aria-label="Toggle color scheme"
      size={ICON_WRAPPER_SIZE * 1.25}
    >
      <display.icon size={ICON_SIZE * 1.25} stroke={ICON_STROKE_WIDTH} />
    </ActionIcon>
  );
}
