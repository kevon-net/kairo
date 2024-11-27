'use client';

import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
import { ActionIcon } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import React from 'react';

export default function ScrollTop({ onClick }: { onClick: () => void }) {
  return (
    <ActionIcon size={iconWrapperSize} onClick={onClick}>
      <IconArrowUp size={iconSize} stroke={iconStrokeWidth} />
    </ActionIcon>
  );
}
