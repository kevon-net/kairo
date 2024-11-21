import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles/global.css";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";

import "@/styles/globals.scss";

import { ColorSchemeScript, MantineColorScheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

// import { SpeedInsights } from "@vercel/speed-insights/next";

import appTheme from "@/styles/theme";
import appResolver from "@/styles/resolver";

import appData from "@/data/app";
import { linkify } from "@/utilities/formatters/string";

import SessionProvider from "@/components/providers/session";
import ColorSchemeProvider from "@/components/providers/color-scheme";
import { getSession } from "@/libraries/auth";

import AffixOffline from "@/components/common/affixi/offline";
import { getCookie } from "@/utilities/helpers/cookie-server";
import { cookieName } from "@/data/constants";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: { default: `${appData.name.app}`, template: `%s - ${appData.name.app}` },
	description: "App description",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const colorScheme = await getCookie(cookieName.colorScheme);

	return (
		<html lang="en" data-mantine-color-scheme={(colorScheme || "light") as MantineColorScheme}>
			<head>
				<ColorSchemeScript defaultColorScheme={(colorScheme || "light") as MantineColorScheme} />
			</head>

			<body className={noto.className}>
				<SessionProvider sessionData={await getSession()}>
					<MantineProvider
						theme={appTheme}
						cssVariablesResolver={appResolver}
						defaultColorScheme={(colorScheme || "light") as MantineColorScheme}
						classNamesPrefix={linkify(appData.name.app)}
					>
						<ColorSchemeProvider scheme={(await getCookie(cookieName.colorSchemeState)) || "light"}>
							<ModalsProvider>{children}</ModalsProvider>
						</ColorSchemeProvider>

						<Notifications limit={3} />

						<AffixOffline />
					</MantineProvider>
				</SessionProvider>

				{/* <SpeedInsights /> */}
			</body>
		</html>
	);
}
