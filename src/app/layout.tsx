import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  ColorSchemeScript,
  MantineColorScheme,
  MantineProvider,
} from '@mantine/core';
import appTheme from '@/styles/theme';
import { COOKIE_NAME, DEFAULT_COLOR_SCHEME } from '@/data/constants';
import appResolver from '@/styles/resolver';
import ProviderStore from '@/components/providers/store';
import { Notifications } from '@mantine/notifications';
import { linkify } from '@/utilities/formatters/string';
import appData from '@/data/app';

// core styles are required for all packages
import '@mantine/core/styles.css';

// other css files are required only if you are using components from the corresponding package
import '@mantine/dates/styles.css';

import '../styles/globals.scss';
import { getCookieServer } from '@/utilities/helpers/cookie-server';

// fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// metadata
export const metadata: Metadata = {
  title: appData.name.app,
  description: appData.companyOneLiner,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorScheme = await getCookieServer(COOKIE_NAME.COLOR_SCHEME_STATE);

  return (
    <html
      lang="en"
      data-mantine-color-scheme={colorScheme || DEFAULT_COLOR_SCHEME}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{appData.name.app}</title>
        <meta name="description" content={appData.companyOneLiner} />

        <ColorSchemeScript
          defaultColorScheme={
            (colorScheme as MantineColorScheme) || DEFAULT_COLOR_SCHEME
          }
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider
          theme={appTheme}
          cssVariablesResolver={appResolver}
          defaultColorScheme={
            (colorScheme as MantineColorScheme) || DEFAULT_COLOR_SCHEME
          }
          classNamesPrefix={linkify(appData.name.app)}
        >
          <ProviderStore>
            {children}

            <Notifications limit={3} />
          </ProviderStore>
        </MantineProvider>
      </body>
    </html>
  );
}
