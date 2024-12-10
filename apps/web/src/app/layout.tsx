import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles/global.css';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import '@/styles/globals.scss';

import {
  ColorSchemeScript,
  MantineColorScheme,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

// import { SpeedInsights } from "@vercel/speed-insights/next";

import appTheme from '@/styles/theme';
import appResolver from '@/styles/resolver';

import appData from '@/data/app';
import { linkify } from '@repo/utils/formatters';

import { getSession } from '@/libraries/auth';

import AffixOffline from '@/components/common/affixi/offline';
import { cookieName } from '@/data/constants';

import ProviderStore from '@/components/providers/store';
import { cookies } from 'next/headers';
import { getGeoData } from '@/libraries/geolocation';

const noto = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: `${appData.name.app}`,
    template: `%s - ${appData.name.app}`,
  },
  description: 'App description',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorScheme = cookies().get(cookieName.colorScheme)?.value;
  const colorSchemeState = cookies().get(cookieName.colorSchemeState)?.value;

  return (
    <html
      lang="en"
      data-mantine-color-scheme={(colorScheme || 'light') as MantineColorScheme}
    >
      <head>
        <ColorSchemeScript
          defaultColorScheme={(colorScheme || 'light') as MantineColorScheme}
        />
      </head>

      <body className={noto.className}>
        <ProviderStore
          colorScheme={colorSchemeState || 'light'}
          session={await getSession()}
          geoData={await getGeoData()}
        >
          <MantineProvider
            theme={appTheme}
            cssVariablesResolver={appResolver}
            defaultColorScheme={(colorScheme || 'light') as MantineColorScheme}
            classNamesPrefix={linkify(appData.name.app)}
          >
            <ModalsProvider>{children}</ModalsProvider>

            <Notifications limit={3} />

            <AffixOffline />
          </MantineProvider>
        </ProviderStore>

        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
