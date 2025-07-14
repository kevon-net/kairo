'use client';

import React from 'react';
import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  ScrollArea,
} from '@mantine/core';
import { APPSHELL } from '@/data/constants';
import { useAppSelector } from '@/hooks/redux';
import NavbarAppHeader from '@/components/layout/navbars/app/header';
import NavbarAppFooter from '@/components/layout/navbars/app/footer';
import NavbarAppMain from '@/components/layout/navbars/app/main';
import HeaderAppContent from '@/components/layout/headers/app/content';

export default function Main({ children }: { children: React.ReactNode }) {
  const appShell = useAppSelector((state) => state.appShell.value);

  if (!appShell) return null;

  return (
    <AppShell
      withBorder={false}
      navbar={{
        width: APPSHELL.NAVBAR_WIDTH,
        breakpoint: 'xs',
        collapsed: {
          mobile: !appShell.navbar,
          desktop: !appShell.navbar,
        },
      }}
    >
      <AppShellNavbar
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
        }
      >
        <AppShellSection id="navbar-header">
          <NavbarAppHeader />
        </AppShellSection>

        <AppShellSection
          id="navbar-main"
          grow
          component={ScrollArea}
          type="hover"
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <NavbarAppMain />
        </AppShellSection>

        <AppShellSection id="navbar-footer">
          <NavbarAppFooter />
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>
        <AppShellSection
          id="main"
          h={'100vh'}
          component={ScrollArea}
          type="hover"
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <HeaderAppContent />

          {children}
        </AppShellSection>
      </AppShellMain>
    </AppShell>
  );
}
