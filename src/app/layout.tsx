import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  ColorSchemeScript,
  MantineColorScheme,
  MantineProvider,
} from '@mantine/core';
import appTheme from '@/styles/theme';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/data/constants';
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
  title: 'Next Static Template',
  description:
    'A lightweight and optimized Next.js template for building fast, SEO-friendly static websites.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const colorScheme = cookieStore.get(COOKIE_NAME.COLOR_SCHEME)?.value;
  const colorSchemeState = cookieStore.get(
    COOKIE_NAME.COLOR_SCHEME_STATE
  )?.value;

  return (
    <html
      lang="en"
      data-mantine-color-scheme={(colorScheme || 'light') as MantineColorScheme}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Next Static Template</title>

        <ColorSchemeScript
          defaultColorScheme={(colorScheme || 'light') as MantineColorScheme}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider
          theme={appTheme}
          cssVariablesResolver={appResolver}
          defaultColorScheme={(colorScheme || 'light') as MantineColorScheme}
          classNamesPrefix={linkify(appData.name.app)}
        >
          <ProviderStore colorScheme={colorSchemeState || 'light'}>
            {children}

            <Notifications limit={3} />
          </ProviderStore>
        </MantineProvider>
      </body>
    </html>
  );
}
