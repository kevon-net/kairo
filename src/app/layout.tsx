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
import { linkify } from '@/utilities/formatters/string';

import { createClient } from '@/libraries/supabase/server';

import AffixOffline from '@/components/common/affixi/offline';
import { COOKIE_NAME } from '@/data/constants';

import ProviderStore from '@/components/providers/store';
import { cookies } from 'next/headers';
import AffixiCookies from '@/components/common/affixi/cookies';

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
  const colorScheme = cookies().get(COOKIE_NAME.COLOR_SCHEME)?.value;
  const colorSchemeState = cookies().get(COOKIE_NAME.COLOR_SCHEME_STATE)?.value;

  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      data-mantine-color-scheme={(colorScheme || 'light') as MantineColorScheme}
    >
      <head>
        <ColorSchemeScript
          defaultColorScheme={(colorScheme || 'light') as MantineColorScheme}
        />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>

      <body className={noto.className}>
        <ProviderStore
          colorScheme={colorSchemeState || 'light'}
          session={session.user}
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
            <AffixiCookies />
          </MantineProvider>
        </ProviderStore>

        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
