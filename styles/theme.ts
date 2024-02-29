"use client";

import { Container, createTheme } from "@mantine/core";

const projectName = createTheme({
	//font
	fontSmoothing: true,

	// color
	colors: {
		pri: [
			"#fff8e1",
			"#ffefcc",
			"#ffdd9b",
			"#ffca64",
			"#ffba38",
			"#ffb01b",
			"#ffab09",
			"#e39500",
			"#ca8500",
			"#af7100",
		],
		sec: [
			"#ffe9e9",
			"#ffd1d1",
			"#fba0a1",
			"#f76d6d",
			"#f34141",
			"#f22625",
			"#f21616",
			"#d8070b",
			"#c10008",
			"#a90003",
		], // (optional)
	},
	primaryColor: "pri",
	primaryShade: 6,
	defaultGradient: {
		from: "pri",
		to: "sec",
		deg: 45,
	},

	// ui
	cursorType: "pointer",

	// other
	components: {
		Container: Container.extend({
			defaultProps: {
				size: "lg",
			},
		}),
	},
});

export default projectName;
