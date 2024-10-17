"use client";

import { Anchor, Card, Container, createTheme, Notification, rem, virtualColor } from "@mantine/core";

import cx from "clsx";

import classesNotification from "./mantine/notification.module.scss";
import classesContainer from "./mantine/container.module.scss";
import classesAnchor from "./mantine/anchor.module.scss";

const appTheme = createTheme({
	focusRing: "auto",

	focusClassName: "focus",

	activeClassName: "active",

	colors: {
		primaryDark: [
			"#000000", // Black
			"#1a1a1a",
			"#333333",
			"#666666",
			"#808080", // Medium Gray
			"#999999",
			"#b3b3b3",
			"#cccccc",
			"#f2f2f2",
			"#ffffff", // White
		],

		primaryLight: [
			"#ffffff", // White
			"#cccccc",
			"#b3b3b3",
			"#999999",
			"#808080", // Medium Gray
			"#666666",
			"#4d4d4d",
			"#333333",
			"#1a1a1a",
			"#000000", // Black
		],

		pri: virtualColor({
			name: "pri",
			dark: "primaryDark",
			light: "primaryLight",
		}),
	},

	primaryColor: "pri",

	primaryShade: { light: 9, dark: 9 },

	defaultGradient: {
		from: "primaryDark",
		to: "primaryLight",
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
		Anchor: Anchor.extend({ defaultProps: { underline: "never" }, classNames: classesAnchor }),

		Card: Card.extend({
			defaultProps: {
				bg: "var(--mantine-color-pri-light)",
				c: "var(--mantine-color-text)",
			},
		}),

		Container: Container.extend({
			defaultProps: {
				mx: "auto",
			},

			classNames: (_: any, { size }: { size?: any }) => ({
				root: cx({ [classesContainer.root]: size === "responsive" }),
			}),
		}),

		Notification: Notification.extend({ classNames: classesNotification }),
	},
});

export default appTheme;
