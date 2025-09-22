'use client';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
} from '@mantine/core';
import { APPSHELL } from '@/data/constants';
import { useAppSelector } from '@/hooks/redux';
import NavbarAppMainParent from '@/components/layout/navbars/app/main/parent';
import NavbarAppFooterParent from '@/components/layout/navbars/app/footer/parent';
import HeaderAppMain from '@/components/layout/headers/app/main';
import AppshellAppChild from './child';

export default function Main({ children }: { children: React.ReactNode }) {
  const appShell = useAppSelector((state) => state.appShell.value);

  if (!appShell) return null;

  return (
    <AppShell
      header={{ height: APPSHELL.HEADER_HEIGHT }}
      navbar={{
        width: APPSHELL.NAVBAR_WIDTH,
        breakpoint: 'xs',
        collapsed: {
          mobile: !appShell.navbar,
          desktop: !appShell.navbar,
        },
      }}
    >
      <AppShellHeader
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
        }
      >
        <HeaderAppMain />
      </AppShellHeader>

      <AppShellNavbar
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
        }
      >
        <AppShellSection id="navbar-main" grow>
          <NavbarAppMainParent />
        </AppShellSection>

        <AppShellSection id="navbar-footer">
          <NavbarAppFooterParent />
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>
        <AppshellAppChild>{children}</AppshellAppChild>
      </AppShellMain>
    </AppShell>
  );
}
