'use client';

import React from 'react';

import { Button, ButtonProps, Tooltip } from '@mantine/core';

export default function ClearSessions({
  children,
  ...restProps
}: { children: React.ReactNode } & ButtonProps) {
  return (
    <Tooltip
      label={'Log out of active sessions on all your devices besides this one.'}
      withArrow
      arrowPosition="side"
      position="top-end"
      multiline
      w={280}
      arrowOffset={16}
      transitionProps={{ transition: 'fade', duration: 250 }}
    >
      <Button size="xs" {...restProps} onClick={async () => {}}>
        {children}
      </Button>
    </Tooltip>
  );
}
