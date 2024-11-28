import { iconSize, iconStrokeWidth } from '@/data/constants';
import { Center, Tooltip, TooltipProps } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import React from 'react';

export default function Info({
  props,
  ...restProps
}: {
  props?: { label?: string };
} & Omit<TooltipProps, 'children' | 'label'>) {
  return (
    <Tooltip
      label={props?.label || 'We will not share your email'}
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
      arrowOffset={8}
      {...restProps}
    >
      <Center style={{ cursor: 'help' }}>
        <IconInfoCircle size={iconSize} stroke={iconStrokeWidth} />
      </Center>
    </Tooltip>
  );
}
