import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { Center, Tooltip, TooltipProps } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import React from 'react';

export default function Warning({
  props,
  ...restProps
}: {
  props: { label: string };
} & Omit<TooltipProps, 'children' | 'label'>) {
  return (
    <Tooltip
      label={props.label}
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
      arrowOffset={8}
      {...restProps}
    >
      <Center style={{ cursor: 'help' }}>
        <IconAlertTriangle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </Center>
    </Tooltip>
  );
}
