"use client";

import React from "react";

import { Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function Responsive({
	children,
	...restProps
}: { children: React.ReactNode } & React.ComponentProps<typeof Container>) {
	const xs = useMediaQuery("(min-width: 36em)");
	const sm = useMediaQuery("(min-width: 48em)");
	const md = useMediaQuery("(min-width: 62em)");
	const lg = useMediaQuery("(min-width: 75em)");
	const xl = useMediaQuery("(min-width: 88em)");

	const handleSize = () => {
		if (xl) {
			return "xl";
		} else if (lg) {
			return "lg";
		} else if (md) {
			return "md";
		} else if (sm) {
			return "sm";
		} else if (xs) {
			return "xs";
		} else {
			return undefined;
		}
	};

	return (
		<Container size={handleSize()} {...restProps}>
			{children}
		</Container>
	);
}
