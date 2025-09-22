'use client';

import { useAppSelector } from '@/hooks/redux';
import { Box, Group, ScrollArea } from '@mantine/core';
import React from 'react';
import { APPSHELL } from '@/data/constants';
import NavbarAppMainChild from '@/components/layout/navbars/app/main/child';
import AsideAppMainChild from '@/components/layout/asides/app/main/child';

export default function Child({ children }: { children: React.ReactNode }) {
  const appShell = useAppSelector((state) => state.appShell.value);
  if (!appShell) return null;

  const widths = {
    navbarLeft: 22.5,
    navbarRight: 22.5,
  };

  return (
    <Group wrap="nowrap" align="stretch" gap={0}>
      <Box
        style={{
          overflow: 'hidden',
          width: `${appShell.child.navbar ? widths.navbarLeft : 0}%`,
          transition: '0.1s all ease',
          borderRight: '1px solid var(--mantine-color-default-border)',
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))',
        }}
      >
        <ScrollArea
          h={`calc(100vh - ${APPSHELL.HEADER_HEIGHT}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <NavbarAppMainChild />
        </ScrollArea>
      </Box>

      <Box
        style={{
          width: `${appShell.child.navbar && appShell.child.aside ? 100 - (widths.navbarLeft + widths.navbarRight) : appShell.child.navbar ? 100 - widths.navbarLeft : appShell.child.aside ? 100 - widths.navbarRight : 100}%`,
          transition: '0.1s all ease',
        }}
      >
        <ScrollArea
          h={`calc(100vh - ${APPSHELL.HEADER_HEIGHT}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          {children}
        </ScrollArea>
      </Box>

      <Box
        style={{
          overflow: 'hidden',
          width: `${appShell?.child.aside ? widths.navbarRight : 0}%`,
          transition: '0.1s all ease',
          borderLeft: '1px solid var(--mantine-color-default-border)',
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))',
        }}
      >
        <ScrollArea
          h={`calc(100vh - ${APPSHELL.HEADER_HEIGHT}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <AsideAppMainChild />
        </ScrollArea>
      </Box>
    </Group>
  );
}
