'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import {
  IconClockPlus,
  IconInputSearch,
  IconTerminal,
  IconTimeline,
} from '@tabler/icons-react';
import React from 'react';
import SpotlightSearch from '@/components/spotlights/search';
import SpotlightCommands from '@/components/spotlights/commands';

export default function Main() {
  return (
    <Stack p={`xs`} gap={5}>
      <Tooltip label={'Quick create session'} position={'right'}>
        <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
          <IconClockPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={'See full timeline'} position={'right'}>
        <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
          <IconTimeline size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>

      <SpotlightSearch>
        <Tooltip label={'Open project finder'} position={'right'}>
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconInputSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </SpotlightSearch>

      <SpotlightCommands>
        <Tooltip label={'Open command palette'} position={'right'}>
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </SpotlightCommands>
    </Stack>
  );
}
