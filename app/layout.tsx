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

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

// import { SpeedInsights } from "@vercel/speed-insights/next";

import appTheme from "@/styles/theme";
import appResolver from "@/styles/resolver";

import appData from "@/data/app";
import { linkify } from "@/utilities/formatters/string";

import SessionProvider from "@/components/providers/session";
import { getSession } from "@/libraries/auth";

import AffixOffline from "@/components/common/affixi/offline";

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
	return (
		<html lang="en" data-mantine-color-scheme="dark">
			<head>
				<ColorSchemeScript defaultColorScheme="dark" />
			</head>

			<body className={noto.className}>
				<SessionProvider sessionData={await getSession()}>
					<MantineProvider
						theme={appTheme}
						cssVariablesResolver={appResolver}
						defaultColorScheme="dark"
						classNamesPrefix={linkify(appData.name.app)}
					>
						<ModalsProvider>{children}</ModalsProvider>

						<Notifications limit={3} />

						<AffixOffline />
					</MantineProvider>
				</SessionProvider>

				{/* <SpeedInsights /> */}
			</body>
		</html>
	);
}
