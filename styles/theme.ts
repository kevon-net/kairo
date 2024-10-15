"use client";

import { Container, createTheme, Notification, rem } from "@mantine/core";

import classesNotification from "./mantine/notification.module.scss";
import classesContainer from "./mantine/container.module.scss";

const appTheme = createTheme({
	focusRing: "auto",

	focusClassName: "focus",

	activeClassName: "active",

	colors: {
		pri: [
			"#f3f3fe",
			"#e4e6ed",
			"#c8cad3",
			"#a9adb9",
			"#9093a4",
			"#808496",
			"#767c91",
			"#656a7e",
			"#585e72",
			"#4a5167",
		],
	},

	primaryColor: "pri",

	primaryShade: { light: 7, dark: 7 },

	defaultGradient: {
		from: "pri",
		to: "sec",
		deg: 45,
	},

	defaultRadius: "sm",

	autoContrast: true,

	luminanceThreshold: 0.3,

	// fontFamily: "Arial, sans-serif",

	// fontFamilyMonospace: "Courier New, monospace",

	fontSmoothing: true,

	fontSizes: {
		xs: rem(12),
		sm: rem(14),
		md: rem(16),
		lg: rem(18),
		xl: rem(20),

		// additional
		xxl: "2rem",
	},

	lineHeights: {
		xs: "1.4",
		sm: "1.45",
		md: "1.55",
		lg: "1.6",
		xl: "1.65",
	},

	headings: {
		// // properties for all headings
		// fontWeight: "bold",
		// fontFamily: "Roboto",

		// properties for individual headings, all of them are optional
		sizes: {
			h1: {
				fontSize: "2rem",
				lineHeight: "1.5",
			},
			h2: {
				fontSize: "1.5rem",
				lineHeight: "1.6",
			},
		},
	},

	spacing: {
		xs: rem(10),
		sm: rem(12),
		md: rem(16),
		lg: rem(20),
		xl: rem(32),
	},

	cursorType: "pointer",

	components: {
		Container: Container.extend({
			defaultProps: { mx: "auto" },
			classNames: classesContainer,
		}),

		Notification: Notification.extend({ classNames: classesNotification }),
	},
});

export default appTheme;
