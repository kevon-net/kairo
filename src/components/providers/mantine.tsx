'use client';

import React from 'react';
import { MantineProvider, MantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { COOKIE_NAME, DEFAULT_COLOR_SCHEME } from '@/data/constants';
import appTheme from '@/styles/theme';
import appResolver from '@/styles/resolver';
import { linkify } from '@/utilities/formatters/string';
import { appName } from '@/data/app';
import { getCookieClient } from '@/utilities/helpers/cookie-client';

export default function Mantine({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: { colorScheme?: MantineColorScheme };
}) {
  const colorScheme =
    getCookieClient(COOKIE_NAME.COLOR_SCHEME) || DEFAULT_COLOR_SCHEME;

  return (
    <MantineProvider
      theme={appTheme}
      cssVariablesResolver={appResolver}
      classNamesPrefix={linkify(appName)}
      defaultColorScheme={
        (props?.colorScheme || colorScheme) as MantineColorScheme
      }
    >
      {children}

      <Notifications position="top-right" />
    </MantineProvider>
  );
}
