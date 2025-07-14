import type { Metadata } from 'next';
import {
  ColorSchemeScript,
  MantineColorScheme,
  mantineHtmlProps,
} from '@mantine/core';
import { Geist, Geist_Mono } from 'next/font/google';

// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/spotlight/styles.css';

// custom styles
import '../styles/globals.scss';

import { appDesc, appName } from '@/data/app';
import { COOKIE_NAME, DEFAULT_COLOR_SCHEME } from '@/data/constants';
import { cookies } from 'next/headers';
import ProviderMantine from '@/components/providers/mantine';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: appName,
  description: appDesc,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const colorScheme =
    cookieStore.get(COOKIE_NAME.COLOR_SCHEME)?.value || DEFAULT_COLOR_SCHEME;

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={colorScheme as MantineColorScheme}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* General Web App Metadata */}
        <meta name="application-name" content={appName} />
        <meta name="theme-color" content="#b08e67" />

        {/* Apple Web App Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={appName} />

        {/* Misc. Mobile Enhancements */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/brand/icon/web-app-manifest-192x192.png"
        />

        <ColorSchemeScript
          defaultColorScheme={colorScheme as MantineColorScheme}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ProviderMantine
          props={{ colorScheme: colorScheme as MantineColorScheme }}
        >
          {children}
        </ProviderMantine>
      </body>
    </html>
  );
}
