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
  const coScCo = await getCookieServer(COOKIE_NAME.COLOR_SCHEME_STATE);
  const colorScheme = coScCo || DEFAULT_COLOR_SCHEME;

  return (
    <html lang="en" data-mantine-color-scheme={colorScheme}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={appData.companyOneLiner} />

        <title>{appData.name.app}</title>

        <ColorSchemeScript
          defaultColorScheme={colorScheme as MantineColorScheme}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider
          theme={appTheme}
          cssVariablesResolver={appResolver}
          defaultColorScheme={colorScheme as MantineColorScheme}
          classNamesPrefix={linkify(appData.name.app)}
        >
          {children}

          <Notifications limit={3} />
        </MantineProvider>
      </body>
    </html>
  );
}
